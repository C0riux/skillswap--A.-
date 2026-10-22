document.addEventListener("DOMContentLoaded", function () {
    const detailButtons = document.querySelectorAll(".details-button");

    detailButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const card = button.closest(".skill-card");
            const details = card.querySelector(".skill-details");

            // Determine whether the details are currently hidden.
            const isExpanded = button.getAttribute("aria-expanded") === "true";

            // Toggle the details visibility.
            details.hidden = isExpanded;

            // Update the button state and its label.
            button.setAttribute("aria-expanded", String(!isExpanded));
            button.textContent = isExpanded
                ? "More Information"
                : "Show Less";

            // Highlight the card when its details are expanded.
            card.classList.toggle("expanded", !isExpanded);
        });
    });
});
