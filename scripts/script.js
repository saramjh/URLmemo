// UTF-8 문자열을 Base64로 암호화
function encrypt(text) {
	return btoa(unescape(encodeURIComponent(text))) // UTF-8 인코딩 후 Base64 인코딩
}

// Base64 문자열을 UTF-8로 복호화
function decrypt(text) {
	return decodeURIComponent(escape(atob(text))) // Base64 디코딩 후 UTF-8 디코딩
}

// 저장 버튼 클릭 이벤트
document.getElementById("saveButton").onclick = function () {
	const content = document.getElementById("editor").value
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
			console.error("클립보드 복사 실패:", err)
		})
}

// URL 파라미터에서 데이터 가져오기
const urlParams = new URLSearchParams(window.location.search)
const encryptedData = urlParams.get("data")

// 데이터가 있을 경우 복호화하여 에디터에 삽입
if (encryptedData) {
	const decryptedContent = decrypt(encryptedData)
	document.getElementById("editor").value = decryptedContent
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
