document.querySelectorAll(".notification .delete")
    .forEach(function ($deleteButton) {
        const parentNotification = $deleteButton.parentNode;
        $deleteButton.addEventListener('click', function () {
            parentNotification
            .parentNode
            .removeChild(parentNotification);
    });
});
