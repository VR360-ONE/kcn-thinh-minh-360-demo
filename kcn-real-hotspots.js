/**
 * Hotspot cho ảnh phối toàn cảnh thực tế KCN Thịnh Minh (Dạ Hợp).
 * panoIndex: 0 Fr00, 1 Fr01, 2 Fr04, 3 Fr05, 4 Topview — u,v ∈ [0,1] (ảnh 2D: trái→phải, trên→dưới).
 */
export const IMMERSIVE_HOTSPOTS_KCN_REAL = [
  {
    id: "kcn-fr00-cong",
    panoIndex: 0,
    title: "Cổng / kiểm soát vào KCN",
    description:
      "Khu vực cổng chính và phân luồng xe — có thể gắn video flycam, sơ đồ PCCC, quy trình đăng ký xe tải.",
    u: 0.394,
    v: 0.468,
  },
  {
    id: "kcn-fr00-truc",
    panoIndex: 0,
    title: "Trục đường nội bộ chính",
    description:
      "Trục giao thông nối các phân khu sản xuất; bản vẽ chi tiết lòng đường, gờ giảm tốc, cây xanh hành lang.",
    u: 0.561,
    v: 0.548,
  },
  {
    id: "kcn-fr00-lo",
    panoIndex: 0,
    title: "Lô nhà xưởng / đất công nghiệp",
    description:
      "Vị trí lô đất có thể cho thuê — diện tích, hạ tầng kỹ thuật (điện, nước, viễn thông) theo hồ sơ mời gọi đầu tư.",
    u: 0.764,
    v: 0.484,
  },
  {
    id: "kcn-fr00-xanh",
    panoIndex: 0,
    title: "Đệm cảnh quan & thoát nước",
    description:
      "Vùng cây xanh đệm, mương thoát nước mặt — phù hợp giải thích quy chuẩn môi trường KCN xanh.",
    u: 0.208,
    v: 0.404,
  },
  {
    id: "kcn-fr00-ha-tang",
    panoIndex: 0,
    title: "Hành lang hạ tầng kỹ thuật",
    description:
      "Trục điện trung thế, ống cấp thoát nước — liên kết bản vẽ hạ tầng ngầm (minh họa theo phối cảnh).",
    u: 0.653,
    v: 0.356,
  },
  {
    id: "kcn-fr00-dahop",
    panoIndex: 0,
    title: "Nhận diện thương hiệu · Dạ Hợp",
    description:
      "Điểm nhấn biển hiệu / không gian đón tiếp nhà đầu tư — có thể chèn liên kết dahop.vn, brochure PDF.",
    u: 0.069,
    v: 0.564,
  },
  {
    id: "kcn-fr01-day",
    panoIndex: 1,
    title: "Dãy nhà xưởng sản xuất",
    description:
      "Khối xưởng module — mô tả chiều cao, tải sàn, cửa container; gợi ý ngành phù hợp theo quy hoạch.",
    u: 0.444,
    v: 0.500,
  },
  {
    id: "kcn-fr01-logistics",
    panoIndex: 1,
    title: "Kho & luồng logistics",
    description:
      "Vùng bốc dỡ, lưu kho tạm — sơ đồ luồng xe, khoảng cách tới cổng và cao tốc (thông tin marketing).",
    u: 0.717,
    v: 0.580,
  },
  {
    id: "kcn-fr01-bai",
    panoIndex: 1,
    title: "Bãi đỗ & điểm quay đầu xe",
    description:
      "Không gian bãi đỗ xe tải / container rời — tiêu chí an toàn giao thông nội bộ.",
    u: 0.861,
    v: 0.452,
  },
  {
    id: "kcn-fr01-pccc",
    panoIndex: 1,
    title: "Lối thoát hiểm & trụ bơm PCCC",
    description:
      "Vị trí minh họa trụ cứu hỏa, lối thoát nạn — gắn nội dung quy định PCCC công nghiệp.",
    u: 0.236,
    v: 0.380,
  },
  {
    id: "kcn-fr01-dv",
    panoIndex: 1,
    title: "Khu dịch vụ phụ trợ",
    description:
      "Căn tin, nhà vệ sinh công cộng, điểm dừng nghỉ cho tài xế — tiện ích cho vận hành KCN.",
    u: 0.611,
    v: 0.324,
  },
  {
    id: "kcn-fr01-dien",
    panoIndex: 1,
    title: "Trạm điện / trung thế",
    description:
      "Điểm neo lưới điện trong phối cảnh — công suất dự phòng, nguồn cấp theo hồ sơ dự án.",
    u: 0.111,
    v: 0.540,
  },
  {
    id: "kcn-fr04-truc",
    panoIndex: 2,
    title: "Trục nhìn dọc KCN",
    description:
      "Góc nhìn dọc theo trục chính — nhấn mạnh quy mô 429,5 ha KCN trong tổ hợp rộng hơn.",
    u: 0.528,
    v: 0.532,
  },
  {
    id: "kcn-fr04-lo",
    panoIndex: 2,
    title: "Phân lô linh hoạt",
    description:
      "Các lô đất có thể ghép / tách — bảng diện tích mẫu và thời hạn thuê đất công nghiệp.",
    u: 0.347,
    v: 0.436,
  },
  {
    id: "kcn-fr04-xanh",
    panoIndex: 2,
    title: "Hành lang xanh & cách ly",
    description:
      "Vùng cây cách ly, giảm tiếng ồn — phù hợp trình bày cam kết công nghiệp xanh.",
    u: 0.819,
    v: 0.420,
  },
  {
    id: "kcn-fr04-cong-phu",
    panoIndex: 2,
    title: "Cổng phụ / trục phụ",
    description:
      "Luồng xe phụ, kiểm soát ra vào hàng ngày — phân tầng an ninh KCN.",
    u: 0.940,
    v: 0.596,
  },
  {
    id: "kcn-fr04-thuy",
    panoIndex: 2,
    title: "Hành lang thủy / thoát nước",
    description:
      "Mương, kênh thoát nước mặt trong phối cảnh — liên kết hồ sơ thủy văn vùng.",
    u: 0.167,
    v: 0.644,
  },
  {
    id: "kcn-fr04-xlnt",
    panoIndex: 2,
    title: "Liên kết XLNT tập trung",
    description:
      "Hướng dẫn nhà đầu tư về nối đường ống nước thải tới trạm XLNT theo quy hoạch KCN.",
    u: 0.681,
    v: 0.340,
  },
  {
    id: "kcn-fr05-giao-thong",
    panoIndex: 3,
    title: "Kết nối giao thông ngoại vi",
    description:
      "Hướng ra trục đường liên vùng — minh họa thời gian di chuyển tới các đầu mối (theo tài liệu chủ đầu tư).",
    u: 0.403,
    v: 0.452,
  },
  {
    id: "kcn-fr05-dieu-hanh",
    panoIndex: 3,
    title: "Trụ sở điều hành / showroom",
    description:
      "Điểm đón khách, mô hình sa bàn, phòng trưng bày dự án — đặt lịch tham quan thực địa.",
    u: 0.633,
    v: 0.516,
  },
  {
    id: "kcn-fr05-mo-rong",
    panoIndex: 3,
    title: "Phân khu mở rộng giai đoạn sau",
    description:
      "Vùng đất dự phòng mở rộng — quy hoạch phân kỳ đầu tư.",
    u: 0.847,
    v: 0.468,
  },
  {
    id: "kcn-fr05-ranh",
    panoIndex: 3,
    title: "Ranh giới KCN & hàng rào",
    description:
      "Minh họa ranh quy hoạch; lưu ý ranh pháp lý lấy theo bản đồ địa chính chính thức.",
    u: 0.083,
    v: 0.580,
  },
  {
    id: "kcn-fr05-bom",
    panoIndex: 3,
    title: "Trạm bơm & thoát nước mưa",
    description:
      "Hạ tầng thoát nước mưa cục bộ — thông số công suất theo thiết kế.",
    u: 0.744,
    v: 0.372,
  },
  {
    id: "kcn-fr05-cay",
    panoIndex: 3,
    title: "Vùng cây xanh lớn",
    description:
      "Công viên cây xanh / vùng phủ xanh tập trung — chỉ số cảnh quan KCN.",
    u: 0.264,
    v: 0.324,
  },
  {
    id: "kcn-top-tong",
    panoIndex: 4,
    title: "Tổng mặt bằng quy hoạch",
    description:
      "Góc nhìn tổng thể KCN Thịnh Minh — quy mô 429,5 ha trong bối cảnh tổ hợp >500 ha (theo tài liệu trình bày).",
    u: 0.500,
    v: 0.460,
  },
  {
    id: "kcn-top-loi",
    panoIndex: 4,
    title: "Phân khu công nghiệp lõi",
    description:
      "Vùng lô sản xuất chính — mật độ xây dựng, chỉ tiêu sử dụng đất công nghiệp.",
    u: 0.375,
    v: 0.564,
  },
  {
    id: "kcn-top-logistics",
    panoIndex: 4,
    title: "Cụm logistics & cổng hàng",
    description:
      "Bố trí kho, bãi container, cổng chính phục vụ vận tải.",
    u: 0.764,
    v: 0.540,
  },
  {
    id: "kcn-top-duong",
    panoIndex: 4,
    title: "Hệ thống đường trục & nút giao",
    description:
      "Mạng đường nội bộ, kết nối cao tốc / quốc lộ — bản đồ giao thông minh họa.",
    u: 0.889,
    v: 0.436,
  },
  {
    id: "kcn-top-dem",
    panoIndex: 4,
    title: "Vùng đệm môi trường",
    description:
      "Cây xanh, khoảng cách cách ly với khu dân cư — cam kết công nghiệp xanh.",
    u: 0.139,
    v: 0.404,
  },
  {
    id: "kcn-top-cum",
    panoIndex: 4,
    title: "Cụm dịch vụ & hỗ trợ",
    description:
      "Khu dịch vụ, nhà ở chuyên gia, thương mại phụ trợ trong tổ hợp rộng hơn KCN.",
    u: 0.653,
    v: 0.356,
  },
];
