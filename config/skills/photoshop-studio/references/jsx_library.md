# Photoshop ExtendScript (JSX) & Action Manager Library

Tài liệu tham khảo các mẫu mã nguồn ExtendScript (JSX) và Action Manager cho kỹ năng `photoshop-studio`.

---

## 1. Cơ chế hoạt động của Action Manager

Trong Photoshop, nhiều thao tác cấp cao (như Select Subject, Smart Object Replace, Camera Raw) không có sẵn trong API DOM tiêu chuẩn của JavaScript (`app.activeDocument...`), mà được điều khiển thông qua **Action Manager** bằng cách gọi `executeAction()`.

### Chuyển đổi ID:
* `stringIDToTypeID("autoCutout")`: Chuyển chuỗi định danh hiện đại thành Type ID.
* `charIDToTypeID("Mk  ")`: Chuyển chuỗi 4 ký tự truyền thống thành Type ID.

---

## 2. Thư viện Snippet mẫu

### A. Tự động nhận diện chủ thể & Tách nền (Select Subject / Sensei AI)
```javascript
function selectSubject() {
    var idautoCutout = stringIDToTypeID("autoCutout");
    var desc = new ActionDescriptor();
    desc.putBoolean(stringIDToTypeID("sampleAllLayers"), false);
    executeAction(idautoCutout, desc, DialogModes.NO);
}
```

### B. Tạo Layer Mask từ vùng chọn hiện tại
```javascript
function makeMaskFromSelection() {
    var idMake = charIDToTypeID("Mk  ");
    var descMask = new ActionDescriptor();
    descMask.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
    var refMask = new ActionReference();
    refMask.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    descMask.putReference(charIDToTypeID("At  "), refMask);
    descMask.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS")); // Reveal Selection
    executeAction(idMake, descMask, DialogModes.NO);
}
```

### C. Thay thế nội dung Smart Object trong Mockup PSD
```javascript
function replaceSmartObjectContents(imageFilePath) {
    var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
    var desc = new ActionDescriptor();
    desc.putPath(charIDToTypeID("null"), new File(imageFilePath));
    executeAction(idplacedLayerReplaceContents, desc, DialogModes.NO);
}
```

### D. Tạo bóng Studio mềm (Ambient Contact Shadow)
```javascript
function createStudioShadow(doc, sourceLayer) {
    // Nhân đôi layer để làm bóng
    var shadowLayer = sourceLayer.duplicate();
    shadowLayer.name = "Ambient Shadow";
    doc.activeLayer = shadowLayer;
    shadowLayer.move(sourceLayer, ElementPlacement.PLACEAFTER);
    
    // Đổi màu thành đen và làm mờ Gaussian Blur
    doc.selection.selectAll();
    var black = new SolidColor();
    black.rgb.red = 0; black.rgb.green = 0; black.rgb.blue = 0;
    doc.selection.fill(black);
    doc.selection.deselect();
    
    shadowLayer.opacity = 35; // 35% độ mờ
    shadowLayer.applyGaussianBlur(12); // Làm mờ 12px
}
```

### E. Xuất ảnh Web tối ưu hoá (PNG trong suốt hoặc JPG sắc nét)
```javascript
function exportOptimizedPNG(doc, outputPath) {
    var opts = new ExportOptionsSaveForWeb();
    opts.format = SaveDocumentType.PNG;
    opts.PNG8 = false; // PNG-24 chất lượng tối đa
    opts.transparency = true;
    opts.interlaced = false;
    opts.includeProfile = false;
    doc.exportDocument(new File(outputPath), ExportType.SAVEFORWEB, opts);
}
```
