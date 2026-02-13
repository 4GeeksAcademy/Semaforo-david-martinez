import React, { useState } from "react";

const TrafficLight = () => {
    //  Estados definidos correctamente
    const [color, setColor] = useState("red");
    const [purpleVisible, setPurpleVisible] = useState(false);

    /**
     * Alterna los colores del semáforo.
     * Incluye lógica para el color púrpura si está activo.
     */
    const cycleColor = () => {
        if (color === "red") setColor("yellow");
        else if (color === "yellow") setColor("green");
        else if (color === "green") {
            purpleVisible ? setColor("purple") : setColor("red");
        } else if (color === "purple") {
            setColor("red");
        }
    };

    return (
        <div className="container-fluid d-flex flex-column align-items-center mt-5">
            {/*  Poste usando clase CSS en lugar de style inline */}
            <div className="traffic-pole"></div>
            
            <div className="bg-black p-3 rounded-3 d-flex flex-column gap-3 shadow-lg">
                {/*  Uso de Template Literals para las clases */}
                <div 
                    onClick={() => setColor("red")}
                    className={`light red ${color === "red" ? "glow" : ""}`}>
                </div>
                <div 
                    onClick={() => setColor("yellow")}
                    className={`light yellow ${color === "yellow" ? "glow" : ""}`}>
                </div>
                <div 
                    onClick={() => setColor("green")}
                    className={`light green ${color === "green" ? "glow" : ""}`}>
                </div>
                
                {purpleVisible && (
                    <div 
                        onClick={() => setColor("purple")}
                        className={`light purple ${color === "purple" ? "glow" : ""}`}>
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