function normalizeShift(shift) {
	const parsed = Number(shift);
	if (!Number.isInteger(parsed) || parsed < 1 || parsed > 25) {
		throw new Error("Le decalage doit etre un entier entre 1 et 25.");
	}
	return parsed;
}

function shiftLetter(char, shift) {
	const code = char.charCodeAt(0);

	if (code >= 65 && code <= 90) {
		const rotated = ((code - 65 + shift + 26) % 26) + 65;
		return String.fromCharCode(rotated);
	}

	if (code >= 97 && code <= 122) {
		const rotated = ((code - 97 + shift + 26) % 26) + 97;
		return String.fromCharCode(rotated);
	}

	return char;
}

function caesarEncrypt(message, shift) {
	const safeShift = normalizeShift(shift);
	let output = "";

	for (const char of message) {
		output += shiftLetter(char, safeShift);
	}

	return output;
}

function caesarDecrypt(message, shift) {
	const safeShift = normalizeShift(shift);
	let output = "";

	for (const char of message) {
		output += shiftLetter(char, -safeShift);
	}

	return output;
}

function caesarBruteForce(cipherText) {
	const attempts = [];

	for (let shift = 1; shift <= 25; shift++) {
		attempts.push({
			shift: shift,
			text: caesarDecrypt(cipherText, shift)
		});
	}

	return attempts;
}

function escapeHtml(value) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function renderBruteForceTable(cipherText, tableBodyElement) {
	if (!tableBodyElement) return;

	const attempts = caesarBruteForce(cipherText);
	const rows = attempts
		.map((attempt) => {
			return "<tr>" +
				"<td>" + attempt.shift + "</td>" +
				"<td>" + escapeHtml(attempt.text) + "</td>" +
				"</tr>";
		})
		.join("");

	tableBodyElement.innerHTML = rows;
}

function initCaesarModule() {
	const messageInput = document.getElementById("caesarMessage");
	const shiftInput = document.getElementById("caesarShift");
	const encryptButton = document.getElementById("caesarEncryptBtn");
	const decryptButton = document.getElementById("caesarDecryptBtn");
	const bruteForceButton = document.getElementById("caesarBruteForceBtn");
	const resultOutput = document.getElementById("caesarResult");
	const bruteForceBody = document.getElementById("caesarBruteForceBody");

	if (!messageInput || !shiftInput) return;

	if (encryptButton && resultOutput) {
		encryptButton.addEventListener("click", () => {
			try {
				resultOutput.textContent = caesarEncrypt(messageInput.value, shiftInput.value);
			} catch (error) {
				resultOutput.textContent = error.message;
			}
		});
	}

	if (decryptButton && resultOutput) {
		decryptButton.addEventListener("click", () => {
			try {
				resultOutput.textContent = caesarDecrypt(messageInput.value, shiftInput.value);
			} catch (error) {
				resultOutput.textContent = error.message;
			}
		});
	}

	if (bruteForceButton && bruteForceBody) {
		bruteForceButton.addEventListener("click", () => {
			renderBruteForceTable(messageInput.value, bruteForceBody);
		});
	}
}

window.caesarEncrypt = caesarEncrypt;
window.caesarDecrypt = caesarDecrypt;
window.caesarBruteForce = caesarBruteForce;
window.renderBruteForceTable = renderBruteForceTable;
window.initCaesarModule = initCaesarModule;

initCaesarModule();
