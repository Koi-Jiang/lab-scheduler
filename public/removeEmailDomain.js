document.getElementById("emailInput").addEventListener("change", (e) => {
	const input = e.target;
	if (input.value.endsWith("@uottawa.ca")) {
		input.value = input.value.slice(0, -11);
	}
});