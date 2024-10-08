// UTF-8 문자열을 Base64로 암호화
function encrypt(text) {
	return btoa(unescape(encodeURIComponent(text))) // UTF-8 인코딩 후 Base64 인코딩
}

// Base64 문자열을 UTF-8로 복호화
function decrypt(text) {
	return decodeURIComponent(escape(atob(text))) // Base64 디코딩 후 UTF-8 디코딩
}

// 에디터 내용 변경 시 로컬 스토리지 업데이트
function updateLocalStorage() {
	const content = document.getElementById("editor").value
	const encryptedContent = encrypt(content)
	localStorage.setItem("editorContent", encryptedContent) // 로컬 스토리지에 저장
}

// 에디터에서 입력 또는 붙여넣기 시 로컬 스토리지 업데이트
document.getElementById("editor").addEventListener("input", updateLocalStorage)

// 저장 버튼 클릭 이벤트
document.getElementById("saveButton").onclick = function () {
	const content = document.getElementById("editor").value

	// 암호화
	const encryptedContent = encrypt(content)
	const url = `${window.location.origin}${window.location.pathname}?data=${encryptedContent}`

	// 클립보드에 URL 복사
	navigator.clipboard
		.writeText(url)
		.then(() => {
			// 모달 표시
			document.getElementById("myModal").style.display = "block"
		})
		.catch((err) => {
			console.error("Clipboard Copy Failed:", err)
		})
}

// 초기화 버튼 클릭 이벤트
document.getElementById("resetButton").onclick = function () {
	document.getElementById("editor").value = "" // 에디터 내용 비우기
	localStorage.removeItem("editorContent") // 로컬 스토리지에서 데이터 삭제
}

// URL 파라미터에서 데이터 가져오기
function getUrlParameter(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
	const regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
	const results = regex.exec(window.location.search)
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "))
}

// 페이지 로드 시 로컬 스토리지 또는 URL 파라미터에서 데이터 가져오기
window.onload = function () {
	const encryptedData = localStorage.getItem("editorContent")
	const urlData = getUrlParameter("data")

	if (urlData) {
		// URL 파라미터에 데이터가 있는 경우
		try {
			const decryptedContent = decrypt(urlData)
			document.getElementById("editor").value = decryptedContent
		} catch (error) {
			console.error("Decryption error:", error)
			alert("Decryption failed. Make sure the data is correct.")
		}
	} else if (encryptedData) {
		// 로컬 스토리지에 데이터가 있는 경우
		try {
			const decryptedContent = decrypt(encryptedData)
			document.getElementById("editor").value = decryptedContent
		} catch (error) {
			console.error("Decryption error:", error)
			alert("Decryption failed. Make sure the data is correct.")
		}
	}
}

// 모달 닫기
document.getElementById("closeModal").onclick = function () {
	document.getElementById("myModal").style.display = "none"
}

// 모달 외부 클릭 시 닫기
window.onclick = function (event) {
	const modal = document.getElementById("myModal")
	if (event.target === modal) {
		modal.style.display = "none"
	}
}
