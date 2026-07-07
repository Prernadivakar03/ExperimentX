import api from "../services/api";

function VariantB({ userId }) {

//   const handleClick = async () => {

//     await api.post("/track-event", {
//       user_id: userId,
//       event_type: "button_click"
//     });

//     alert("Variant B Button Clicked");
//   };

const handlePurchase = async () => {

  // Track button click
  await api.post("/track-event", {
    user_id: userId,
    event_type: "button_click"
  });

  // Track conversion
  await api.post("/track-conversion", {
    user_id: userId
  });

  alert("Purchase Completed");
};

  return (
    <div>
      <h1>Variant B</h1>

    <button onClick={handlePurchase}>
  Complete Purchase
</button>

    </div>
  );
}

export default VariantB;