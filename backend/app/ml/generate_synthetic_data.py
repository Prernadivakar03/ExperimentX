# backend/app/ml/generate_synthetic_data.py
"""
Synthetic data generator for ML model training.

Run with:
    cd backend
    python -m app.ml.generate_synthetic_data --org-id <uuid> --n-visitors 6000

Creates one demo experiment (2 variants) under the given organization, then
generates visitors + events + conversions with DELIBERATE causal structure
baked in — not random noise. This matters: a model trained on pure
np.random data learns nothing and can't be honestly explained in an
interview. Every effect below is a design choice, documented so you can
defend it.

Causal structure:
  - Baseline conversion rate varies by device, traffic_source, is_returning.
    These are realistic, well-documented directional effects (returning
    visitors and organic traffic convert better; mobile converts a bit
    worse than desktop) — not exact real-world numbers, just plausible
    relative ordering.
  - Variant B's UPLIFT is heterogeneous: strong positive effect on mobile
    visitors, ~zero effect on desktop. This is the actual target for the
    uplift model — "who does B help", not just "does B help on average".
  - Session duration / page views are generated AFTER the conversion
    decision, correlated with it but not deterministic — avoids label
    leakage while still giving the conversion model realistic features.
"""
import argparse
import random
import uuid
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.experiment import Experiment, ExperimentStatus
from app.models.variant import Variant
from app.models.visitor import Visitor
from app.models.event import Event
from app.models.conversion import Conversion
from app.models.user import User
from app.models.organization import Membership

random.seed(42)  # reproducible — same synthetic dataset every run

DEVICES = ["mobile", "desktop", "tablet"]
DEVICE_WEIGHTS = [0.55, 0.35, 0.10]

BROWSERS = ["chrome", "safari", "firefox", "edge", "other"]
BROWSER_WEIGHTS = [0.55, 0.20, 0.12, 0.09, 0.04]

COUNTRIES = ["IN", "US", "GB", "DE", "BR", "ID"]
COUNTRY_WEIGHTS = [0.40, 0.25, 0.10, 0.08, 0.09, 0.08]

TRAFFIC_SOURCES = ["organic", "paid", "direct", "social", "referral"]
TRAFFIC_WEIGHTS = [0.35, 0.25, 0.20, 0.12, 0.08]


def base_conversion_prob(device, traffic_source, is_returning):
    """Baseline probability of converting BEFORE any variant effect."""
    p = 0.08  # overall baseline

    p += {"mobile": -0.015, "desktop": 0.02, "tablet": -0.005}[device]
    p += {
        "organic": 0.02, "direct": 0.015, "referral": 0.005,
        "social": -0.005, "paid": -0.01,
    }[traffic_source]
    p += 0.03 if is_returning else 0.0

    return max(0.01, min(0.95, p))


def variant_uplift(device, is_control):
    """
    The heterogeneous treatment effect. Control (A) gets none. Variant B
    gets a strong lift on mobile, almost nothing on desktop/tablet — this
    is exactly what the uplift model needs to learn to detect.
    """
    if is_control:
        return 0.0
    return {"mobile": 0.045, "desktop": 0.003, "tablet": 0.01}[device]


def generate(db: Session, organization_id, owner_id, n_visitors: int):
    experiment = Experiment(
        owner_id=owner_id,
        organization_id=organization_id,
        name="[Synthetic] Checkout CTA color test",
        description="Auto-generated demo experiment for ML model training — safe to delete.",
        goal="purchase",
        status=ExperimentStatus.completed,
    )
    db.add(experiment)
    db.flush()

    variant_a = Variant(experiment_id=experiment.id, name="Control", label="A",
                         description="Original blue CTA button", traffic_split=0.5)
    variant_b = Variant(experiment_id=experiment.id, name="Challenger", label="B",
                         description="High-contrast orange CTA button", traffic_split=0.5)
    db.add_all([variant_a, variant_b])
    db.flush()

    start = datetime.utcnow() - timedelta(days=21)

    converted_count = 0
    for i in range(n_visitors):
        device = random.choices(DEVICES, weights=DEVICE_WEIGHTS)[0]
        browser = random.choices(BROWSERS, weights=BROWSER_WEIGHTS)[0]
        country = random.choices(COUNTRIES, weights=COUNTRY_WEIGHTS)[0]
        traffic_source = random.choices(TRAFFIC_SOURCES, weights=TRAFFIC_WEIGHTS)[0]
        is_returning = random.random() < 0.28

        variant = variant_a if i % 2 == 0 else variant_b
        is_control = variant is variant_a

        p_convert = base_conversion_prob(device, traffic_source, is_returning)
        p_convert += variant_uplift(device, is_control)
        p_convert = max(0.005, min(0.98, p_convert))

        converted = random.random() < p_convert
        created_at = start + timedelta(
            seconds=random.randint(0, 21 * 24 * 3600)
        )

        if converted:
            page_views = random.randint(3, 9)
            session_duration = random.randint(90, 480)
        else:
            page_views = random.randint(1, 5)
            session_duration = random.randint(10, 180)

        visitor = Visitor(
            experiment_id=experiment.id,
            variant_id=variant.id,
            fingerprint=str(uuid.uuid4()),
            device=device,
            browser=browser,
            country=country,
            traffic_source=traffic_source,
            is_returning=is_returning,
            session_duration_seconds=session_duration,
            created_at=created_at,
        )
        db.add(visitor)
        db.flush()

        for _ in range(page_views):
            db.add(Event(
                experiment_id=experiment.id, variant_id=variant.id,
                visitor_id=visitor.id, event_type="page_view",
                timestamp=created_at + timedelta(seconds=random.randint(0, session_duration)),
            ))

        if converted:
            converted_count += 1
            order_value = round(random.uniform(300, 4500), 2)
            db.add(Conversion(
                experiment_id=experiment.id, variant_id=variant.id,
                visitor_id=visitor.id, goal="purchase", value=order_value,
                timestamp=created_at + timedelta(seconds=session_duration),
            ))

        if (i + 1) % 500 == 0:
            db.commit()
            print(f"  {i + 1}/{n_visitors} visitors generated...")

    db.commit()
    print(f"\nDone. Experiment {experiment.id}")
    print(f"{n_visitors} visitors, {converted_count} conversions "
          f"({converted_count / n_visitors * 100:.1f}% overall rate)")
    return experiment.id


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--org-id", required=True, help="organization_id to attach the demo experiment to")
    parser.add_argument("--n-visitors", type=int, default=6000)
    args = parser.parse_args()

    db = SessionLocal()
    try:
        membership = db.query(Membership).filter(
            Membership.organization_id == args.org_id
        ).first()
        if not membership:
            print(f"No membership found for organization {args.org_id} — check the org id.")
            return

        generate(db, organization_id=args.org_id, owner_id=membership.user_id,
                 n_visitors=args.n_visitors)
    finally:
        db.close()


if __name__ == "__main__":
    main()