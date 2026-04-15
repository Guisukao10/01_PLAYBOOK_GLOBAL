const POWER_BI_URL =
    "https://app.powerbi.com/view?r=eyJrIjoiMGVmMTQwYjMtZDI5OS00NWRhLTk2M2QtZTgwNzY3NWM2YmZiIiwidCI6ImE2NzRhMDgxLTBjNTMtNGQyZC1hZWQ2LWRiZjgwNmY5NWExYiJ9";

document.addEventListener("DOMContentLoaded", function () {
    const frame = document.getElementById("dashboardBiFrame");
    if (!frame) return;

    // Mantem o embed alinhado ao link oficial configurado para o dashboard executivo.
    if (frame.src !== POWER_BI_URL) {
        frame.src = POWER_BI_URL;
    }
});
