import React, { useState } from "react";

const TrafficLight = () => {
    // ✅ PATRÓN POSITIVO: useState para manejar el estado de la luz activa
    const [color, setColor] = useState("red");
    const [purpleVisible, setPurpleVisible] = useState(false);
    
    // 💡 MEJORA APLICADA: cycleColor ahora incluye la luz púrpura cuando está visible
    const cycleColor = () => {
        // Definir colores base del ciclo
        const baseColors = ["red", "green", "yellow"];
        
        // Si púrpura está visible, incluirla en el ciclo
        const colors = purpleVisible ? [...baseColors, "purple"] : baseColors;
        
        // Encontrar índice actual y ciclar al siguiente
        const currentIndex = colors.indexOf(color);
        const nextIndex = (currentIndex + 1) % colors.length;
        setColor(colors[nextIndex]);
    };

    return (
        <div className="container-fluid d-flex flex-column align-items-center mt-5">
            {/* 💡 MEJORA APLICADA: Estilos extraídos a clase CSS en lugar de inline */}
            <div className="traffic-light-pole"></div>
            
            <div className="bg-black p-3 rounded-3 d-flex flex-column gap-3 shadow-lg">
                {/* 💡 MEJORA APLICADA: Template literals en lugar de concatenación de strings */}
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
                
                {/* ✅ PATRÓN POSITIVO: Renderizado condicional con && */}
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