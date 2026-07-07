import api from "../services/api";

function VariantA({ userId }) {

//   const handleClick = async () => {

//     await api.post("/track-event", {
//       user_id: userId,
//       event_type: "button_click"
//     });

//     alert("Variant A Button Clicked");
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
      <h1>Variant A</h1>

      {/* <button onClick={handleClick}>
        Buy Now
      </button> */}

      <button onClick={handlePurchase}>
  Complete Purchase
    </button>
    </div>
  );
}

export default VariantA;