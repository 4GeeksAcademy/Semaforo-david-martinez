import React, { useState } from "react";

const TrafficLight = () => {
    const [color, setColor] = useState("red");
    const [purpleVisible, setPurpleVisible] = useState(false);
    const cycleColor = () => {
        if (color === "red") setColor("green");
        else if (color === "green") setColor("yellow");
        else if (color === "yellow") setColor("red");
    };

    return (
        <div className="container-fluid d-flex flex-column align-items-center mt-5">

            <div className="bg-black" style={{ width: "10px", height: "50px" }}></div>
            
            <div className="bg-black p-3 rounded-3 d-flex flex-column gap-3 shadow-lg">
                <div 
                    onClick={() => setColor("red")}
                    className={"light red" + (color === "red" ? " glow" : "")}>
                </div>
                <div 
                    onClick={() => setColor("yellow")}
                    className={"light yellow" + (color === "yellow" ? " glow" : "")}>
                </div>
                <div 
                    onClick={() => setColor("green")}
                    className={"light green" + (color === "green" ? " glow" : "")}>
                </div>
                
                {purpleVisible && (
                    <div 
                        onClick={() => setColor("purple")}
                        className={"light purple" + (color === "purple" ? " glow" : "")}>
                    </div>
                )}
            </div>

            <div className="mt-5 d-flex gap-2">
                <button className="btn btn-primary" onClick={cycleColor}>
                    Alternar Color
                </button>
                <button className="btn btn-info" onClick={() => setPurpleVisible(!purpleVisible)}>
                    {purpleVisible ? "Quitar Púrpura" : "Añadir Púrpura"}
                </button>
            </div>
        </div>
    );
};

export default TrafficLight;