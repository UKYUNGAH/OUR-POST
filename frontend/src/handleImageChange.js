export function handleImageChange(e, setImage, setPreviewImage) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            setPreviewImage(e.target.result);
        };

        reader.readAsDataURL(file);
        setImage(file); // 이미지 파일 상태 업데이트
    }
}
