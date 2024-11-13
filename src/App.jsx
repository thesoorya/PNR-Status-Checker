import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [pnr, setPnr] = useState("");
  const [pnrStatus, setPnrStatus] = useState(null);
  const [error, setError] = useState(null);

  const handlePnrChange = (event) => {
    setPnr(event.target.value);
  };

  const fetchPnrStatus = async () => {
    if (!pnr) {
      setError("Please enter a valid PNR number");
      return;
    }
    try {
      const response = await axios.get(
        `https://${import.meta.env.VITE_RAPIDAPI_HOST}/getPNRStatus/${pnr}`,
        {
          headers: {
            "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
            "x-rapidapi-host": import.meta.env.VITE_RAPIDAPI_HOST,
          },
        }
      );
      console.log(response.data);
      if (response.data.success) {
        setPnrStatus(response.data.data);
        setError(null);
        setPnr("");
      } else {
        setError("Failed to fetch PNR status");
      }
    } catch (err) {
      setError("Failed to fetch PNR status");
      console.error(err);
    }
  };

  return (
    <div className="app">
      <h1 className="title">Indian Railway PNR Status</h1>
      <div className="inputs">
        <input
          type="text"
          placeholder="Enter PNR number"
          value={pnr}
          onChange={handlePnrChange}
        />
        <button onClick={fetchPnrStatus}>Submit</button>
        <small className="sample-pnr">Sample PNR: 8524877944</small>
        {error && <small style={{ color: "red" }}>{error}</small>}
      </div>

      {/*  */}

      {pnrStatus ? (
        <div className="pnr-data">
          <p className="timestamps">
            <small>{pnrStatus.timeStamp}</small>
          </p>
          <p className="pnr-no">
            You Queried for: PNR Number: {pnrStatus.pnrNumber}
          </p>
          <div className="pnr-table">
            {/* Train Details */}
            <div className="pnr-details">
              <div className="scroll-wrap">
                <div className="table-head">
                  <div className="table-items">Train Number</div>
                  <div className="table-items">Train Name</div>
                  <div className="table-items">Boarding Date</div>
                  <div className="table-items">From</div>
                  <div className="table-items">To</div>
                  <div className="table-items">Reserved Up To</div>
                  <div className="table-items">Boarding Point</div>
                  <div className="table-items">Class</div>
                </div>
                <div className="table-data">
                  <div className="table-items">{pnrStatus.trainNumber}</div>
                  <div className="table-items">{pnrStatus.trainName}</div>
                  <div className="table-items">{pnrStatus.dateOfJourney}</div>
                  <div className="table-items">{pnrStatus.sourceStation}</div>
                  <div className="table-items">
                    {pnrStatus.destinationStation}
                  </div>
                  <div className="table-items">{pnrStatus.reservationUpto}</div>
                  <div className="table-items">{pnrStatus.boardingPoint}</div>
                  <div className="table-items">{pnrStatus.journeyClass}</div>
                </div>
              </div>
            </div>
            {/* Passenger Details */}
            <div className="pnr-passenger-details">
              <div className="scroll-wrap">
                <div className="passenger-details-head">
                  <div className="passenger-details-items">S. No.</div>
                  <div className="passenger-details-items">
                    Booking Status (Coach No., Berth No., Quota)
                  </div>
                  <div className="passenger-details-items">Current Status</div>
                  <div className="passenger-details-items">Coach Position</div>
                </div>
                <div className="passenger-details-data">
                  {pnrStatus.passengerList.map((passenger) => (
                    <div
                      className="passenger-row"
                      key={passenger.passengerSerialNumber}
                    >
                      <div className="passenger-details-items">
                        Passenger {passenger.passengerSerialNumber}
                      </div>
                      <div className="passenger-details-items">
                        {passenger.bookingStatusDetails}
                      </div>
                      <div className="passenger-details-items">
                        {passenger.currentStatusDetails}
                      </div>
                      <div className="passenger-details-items">
                        {passenger.currentCoachId || "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/*  */}
            <div className="general-details">
              <p>
                <small>Booking Price: {pnrStatus.ticketFare}</small>
              </p>
              <p>
                <small>Booking Date: {pnrStatus.bookingDate}</small>
              </p>
              <p>
                <small>Distance: {pnrStatus.distance}KM</small>
              </p>
            </div>
          </div>
        </div>
      ) : (
        !error && null
      )}
    </div>
  );
};

export default App;
