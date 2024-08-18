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
			console.error("클립보드 복사 실패:", err)
		})
}

// 페이지 로드 시 로컬 스토리지에서 데이터 가져오기
window.onload = function () {
	const encryptedData = localStorage.getItem("editorContent")

	// 데이터가 있을 경우 복호화하여 에디터에 삽입
	if (encryptedData) {
		try {
			const decryptedContent = decrypt(encryptedData)
			document.getElementById("editor").value = decryptedContent
		} catch (error) {
			console.error("복호화 오류:", error)
			alert("복호화에 실패했습니다. 올바른 데이터인지 확인하세요.")
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
