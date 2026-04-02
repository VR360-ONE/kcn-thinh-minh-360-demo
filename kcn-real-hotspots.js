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
      "Khu vực cổng chính và phân luồng xe — có thể gắn video flycam, sơ đồ PCCC, quy trình đăng ký xe tải.\n\nTrên tour 360°, đây thường là điểm dừng đầu tiên: phù hợp giới thiệu giờ vận hành, quy định kiểm soát tải trọng và liên hệ ban quản lý KCN. Có thể mở rộng bằng biển đồ luồng xe ban ngày / ban đêm hoặc liên kết form đăng ký xe vào ra. Mọi thông tin mang tính minh họa theo phối cảnh; quy trình chính thức lấy theo hồ sơ pháp lý và nội quy KCN.",
    u: 0.394,
    v: 0.468,
  },
  {
    id: "kcn-fr00-truc",
    panoIndex: 0,
    title: "Trục đường nội bộ chính",
    description:
      "Trục giao thông nối các phân khu sản xuất; bản vẽ chi tiết lòng đường, gờ giảm tốc, cây xanh hành lang.\n\nTrục chính quyết định hiệu quả vận hành logistics và thời gian đáp ứng cứu hỏa — phù hợp để trình bày bề rộng mặt đường, vận tốc khuyến nghị và khoảng cách tới các lô xưởng tiêu biểu. Trong demo, có thể chèn sơ đồ cắt dọc đường hoặc ảnh thi công thực tế khi có. Thông số kỹ thuật cuối cùng theo thiết kế được phê duyệt.",
    u: 0.561,
    v: 0.548,
  },
  {
    id: "kcn-fr00-lo",
    panoIndex: 0,
    title: "Lô nhà xưởng / đất công nghiệp",
    description:
      "Vị trí lô đất có thể cho thuê — diện tích, hạ tầng kỹ thuật (điện, nước, viễn thông) theo hồ sơ mời gọi đầu tư.\n\nĐiểm hotspot lô đất giúp nhà đầu tư so sánh nhanh vị trí tương đối so với cổng, trục điện và hành lang xanh. Có thể bổ sung bảng diện tích mẫu, chiều cao công trình cho phép và ngành nghề khuyến khích / hạn chế theo quy hoạch phân khu. Số liệu cụ thể (m², công suất điện, đường kính ống) cần đối chiếu bản vẽ phân lô và hợp đồng thuê đất.",
    u: 0.764,
    v: 0.484,
  },
  {
    id: "kcn-fr00-xanh",
    panoIndex: 0,
    title: "Đệm cảnh quan & thoát nước",
    description:
      "Vùng cây xanh đệm, mương thoát nước mặt — phù hợp giải thích quy chuẩn môi trường KCN xanh.\n\nĐệm cảnh quan vừa giảm tác động thị giác / tiếng ồn vừa góp phần thoát nước bề mặt an toàn trong mùa mưa. Trình bày có thể nhấn mạnh chỉ tiêu phủ xanh, loại cây trồng và cam kết duy tu định kỳ. Hình ảnh phối cảnh không thay thế báo cáo đánh giá tác động môi trường hoặc thiết kế cảnh quan chi tiết.",
    u: 0.208,
    v: 0.404,
  },
  {
    id: "kcn-fr00-ha-tang",
    panoIndex: 0,
    title: "Hành lang hạ tầng kỹ thuật",
    description:
      "Trục điện trung thế, ống cấp thoát nước — liên kết bản vẽ hạ tầng ngầm (minh họa theo phối cảnh).\n\nHành lang kỹ thuật tập trung giúp thi công lô xưởng có lộ trình rõ: điểm đấu nối điện, nước, thoát nước thải và viễn thông. Trên nền tảng marketing, nên ghi rõ đây là minh họa quy hoạch; nhà đầu tư cần khảo sát hiện trường và bản vẽ as-built trước khi thiết kế nhà xưởng. Có thể đính kèm sơ đồ khối cấp — thoát hoặc FAQ về công suất dự phòng.",
    u: 0.653,
    v: 0.356,
  },
  {
    id: "kcn-fr00-dahop",
    panoIndex: 0,
    title: "Nhận diện thương hiệu · Dạ Hợp",
    description:
      "Điểm nhấn biển hiệu / không gian đón tiếp nhà đầu tư — có thể chèn liên kết dahop.vn, brochure PDF.\n\nĐây là điểm neo nhận diện thương hiệu chủ đầu tư Dạ Hợp trong trải nghiệm ảo: phù hợp video giới thiệu 60–90 giây, timeline dự án hoặc chứng nhận / giải thưởng nổi bật. Hotspot có thể dẫn tới trang liên hệ, đăng ký nhận tài liệu hoặc lịch sự kiện xúc tiến đầu tư. Nội dung hiển thị có thể Việt — Anh tùy đối tượng.",
    u: 0.069,
    v: 0.564,
  },
  {
    id: "kcn-fr01-day",
    panoIndex: 1,
    title: "Dãy nhà xưởng sản xuất",
    description:
      "Khối xưởng module — mô tả chiều cao, tải sàn, cửa container; gợi ý ngành phù hợp theo quy hoạch.\n\nDãy xưởng dạng module thường được marketing như giải pháp triển khai nhanh cho sản xuất nhẹ và lắp ráp. Có thể bổ sung bảng so sánh diện tích lô, khẩu độ cột và tiêu chí PCCC điển hình. Ngành nghề gợi ý (điện tử, cơ khí chính xác, logistics nhẹ…) chỉ mang tính tham khảo; phân loại ngành chính thức theo quyết định phê duyệt quy hoạch.",
    u: 0.444,
    v: 0.500,
  },
  {
    id: "kcn-fr01-logistics",
    panoIndex: 1,
    title: "Kho & luồng logistics",
    description:
      "Vùng bốc dỡ, lưu kho tạm — sơ đồ luồng xe, khoảng cách tới cổng và cao tốc (thông tin marketing).\n\nCụm logistics nội bộ cần thể hiện rõ vòng quay xe tải, bãi chờ container và khoảng cách an toàn tới xưởng. Trình bày có thể kèm infographic thời gian di chuyển tới các đầu mối giao thông (minh họa). Mọi số liệu km / phút nên ghi nguồn và điều kiện giao thông; không dùng làm cam kết pháp lý nếu chưa xác minh.",
    u: 0.717,
    v: 0.580,
  },
  {
    id: "kcn-fr01-bai",
    panoIndex: 1,
    title: "Bãi đỗ & điểm quay đầu xe",
    description:
      "Không gian bãi đỗ xe tải / container rời — tiêu chí an toàn giao thông nội bộ.\n\nBãi quay đầu và đỗ tạm giảm ùn tắc trục chính nếu được bố trí hợp lý; phù hợp giải thích quy tắc nhường đường, tốc độ tối đa và vạch dừng. Có thể chèn ảnh minh họa biển báo nội bộ. Thiết kế thực tế phải tuân thiết kế giao thông được duyệt và điều kiện địa hình cụ thể.",
    u: 0.861,
    v: 0.452,
  },
  {
    id: "kcn-fr01-pccc",
    panoIndex: 1,
    title: "Lối thoát hiểm & trụ bơm PCCC",
    description:
      "Vị trí minh họa trụ cứu hỏa, lối thoát nạn — gắn nội dung quy định PCCC công nghiệp.\n\nHotspot PCCC phù hợp checklist: khoảng cách tới trụ bơm, hướng thoát hiểm, điểm tập kết và số hotline cứu hỏa. Nội dung nên nhắc nhà đầu tư tuân thủ quy chuẩn phòng cháy cho từng loại hình xưởng. Vị trí trên ảnh phối cảnh chỉ mang tính minh họa; thi công và nghiệm thu theo thiết kế PCCC được cấp có thẩm quyền phê duyệt.",
    u: 0.236,
    v: 0.380,
  },
  {
    id: "kcn-fr01-dv",
    panoIndex: 1,
    title: "Khu dịch vụ phụ trợ",
    description:
      "Căn tin, nhà vệ sinh công cộng, điểm dừng nghỉ cho tài xế — tiện ích cho vận hành KCN.\n\nKhu dịch vụ phụ trợ nâng chất lượng vận hành hàng ngày: giảm thời gian chờ cho lái xe, hỗ trợ an toàn lao động và giữ trật tự cảnh quan. Có thể mô tả giờ mở cửa, dịch vụ y tế nhanh hoặc điểm sạc điện thoại. Quy mô và vị trí thực tế theo giai đoạn đầu tư và thiết kế tiện ích được phê duyệt.",
    u: 0.611,
    v: 0.324,
  },
  {
    id: "kcn-fr01-dien",
    panoIndex: 1,
    title: "Trạm điện / trung thế",
    description:
      "Điểm neo lưới điện trong phối cảnh — công suất dự phòng, nguồn cấp theo hồ sơ dự án.\n\nTrạm / trục điện là yếu tố then chốt khi nhà đầu tư tính toán phụ tải máy móc. Trình bày marketing có thể nêu cấp điện áp, sơ đồ vòng đơn — kép (minh họa) và thời gian đóng điện dự kiến theo tiến độ hạ tầng. Thông số công suất, điểm đấu nối và hợp đồng mua điện lấy theo hợp đồng với đơn vị điện lực và chủ đầu tư hạ tầng.",
    u: 0.111,
    v: 0.540,
  },
  {
    id: "kcn-fr04-truc",
    panoIndex: 2,
    title: "Trục nhìn dọc KCN",
    description:
      "Góc nhìn dọc theo trục chính — nhấn mạnh quy mô 429,5 ha KCN trong tổ hợp rộng hơn.\n\nTrục dọc giúp người xem cảm nhận chiều sâu không gian và mối liên hệ giữa các phân khu. Phù hợp chèn overlay chỉ số quy mô, so sánh với KCN tương đương hoặc video timelapse thi công. Con số diện tích và ranh giới lấy theo tài liệu pháp lý và hồ sơ quy hoạch cập nhật; ảnh phối cảnh không dùng để đo đạc.",
    u: 0.528,
    v: 0.532,
  },
  {
    id: "kcn-fr04-lo",
    panoIndex: 2,
    title: "Phân lô linh hoạt",
    description:
      "Các lô đất có thể ghép / tách — bảng diện tích mẫu và thời hạn thuê đất công nghiệp.\n\nPhân lô linh hoạt hỗ trợ nhà đầu tư mở rộng theo giai đoạn: có thể trình bày ví dụ ghép hai lô trung bình thành một xưởng lớn hoặc tách lô cho nhà cung cấp phụ trợ. Nên kèm lưu ý về lộ giới, chỉ giới xây dựng và hành lang bảo vệ công trình công cộng. Điều kiện chuyển nhượng / thuê phụ thuộc hợp đồng và quy định pháp luật tại thời điểm ký kết.",
    u: 0.347,
    v: 0.436,
  },
  {
    id: "kcn-fr04-xanh",
    panoIndex: 2,
    title: "Hành lang xanh & cách ly",
    description:
      "Vùng cây cách ly, giảm tiếng ồn — phù hợp trình bày cam kết công nghiệp xanh.\n\nHành lang xanh đóng vai trò đệm sinh thái giữa khu sản xuất và không gian mở hoặc khu dân cư lân cận. Có thể mô tả loại cây bản địa, tần suất tưới và kế hoạch thay thế cây trưởng thành. Cam kết môi trường trong brochure nên được kiểm chứng bằng báo cáo quan trắc định kỳ sau vận hành.",
    u: 0.819,
    v: 0.420,
  },
  {
    id: "kcn-fr04-cong-phu",
    panoIndex: 2,
    title: "Cổng phụ / trục phụ",
    description:
      "Luồng xe phụ, kiểm soát ra vào hàng ngày — phân tầng an ninh KCN.\n\nCổng phụ giảm tải cho cổng chính khi có nhiều nhà đầu tư cùng vận hành; thường gắn barrier, camera và sổ lệnh. Phù hợp giải thích phân quyền truy cập theo lô đất. Quy chế an ninh, số lượng cổng và vị trí thực tế theo phương án ban quản lý và cơ quan chức năng.",
    u: 0.940,
    v: 0.596,
  },
  {
    id: "kcn-fr04-thuy",
    panoIndex: 2,
    title: "Hành lang thủy / thoát nước",
    description:
      "Mương, kênh thoát nước mặt trong phối cảnh — liên kết hồ sơ thủy văn vùng.\n\nHệ thoát nước mặt cần đọc cùng cống ngầm và hồ điều hòa (nếu có) để tránh ngập cục bộ. Marketing có thể dẫn link tới báo cáo thủy văn tóm tắt hoặc mực nước thiết kế. Thi công và nghiệm thu theo thiết kế được duyệt; phối cảnh không phản ánh đúng kích thước hạng mục thật.",
    u: 0.167,
    v: 0.644,
  },
  {
    id: "kcn-fr04-xlnt",
    panoIndex: 2,
    title: "Liên kết XLNT tập trung",
    description:
      "Hướng dẫn nhà đầu tư về nối đường ống nước thải tới trạm XLNT theo quy hoạch KCN.\n\nLiên kết XLNT là một trong các điểm kỹ thuật hay được hỏi trong giai đoạn due diligence: tiêu chuẩn nước đầu ra, loại ngành cần xử lý sơ bộ trước khi đấu nối, và trách nhiệm vận hành. Có thể đính kèm sơ đồ khối xử lý tóm tắt. Thông số công suất trạm và quy chuẩn thải lấy theo giấy phép môi trường và hợp đồng hạ tầng.",
    u: 0.681,
    v: 0.340,
  },
  {
    id: "kcn-fr05-giao-thong",
    panoIndex: 3,
    title: "Kết nối giao thông ngoại vi",
    description:
      "Hướng ra trục đường liên vùng — minh họa thời gian di chuyển tới các đầu mối (theo tài liệu chủ đầu tư).\n\nKết nối giao thông ngoại vi là đòn bẩy thương mại: có thể bổ sung bản đồ nhỏ, khoảng cách tới cảng — sân bay — khu dân cư lao động. Luôn ghi rõ điều kiện áp dụng (giờ cao điểm, tuyến đang mở rộng). Số liệu thời gian và km chỉ mang tính tham khảo marketing trừ khi đính kèm nguồn khảo sát độc lập.",
    u: 0.403,
    v: 0.452,
  },
  {
    id: "kcn-fr05-dieu-hanh",
    panoIndex: 3,
    title: "Trụ sở điều hành / showroom",
    description:
      "Điểm đón khách, mô hình sa bàn, phòng trưng bày dự án — đặt lịch tham quan thực địa.\n\nTrụ sở / showroom là nơi chốt ấn tượng thương hiệu: video tổng thể, wall ảnh tiến độ, corner ESG. Hotspot có thể mở form đặt lịch, QR brochure hoặc liên hệ bộ phận xúc tiến. Lịch tham quan và nội quy khu vực hạn chế ghi rõ để tránh kỳ vọng sai khi đến thực địa.",
    u: 0.633,
    v: 0.516,
  },
  {
    id: "kcn-fr05-mo-rong",
    panoIndex: 3,
    title: "Phân khu mở rộng giai đoạn sau",
    description:
      "Vùng đất dự phòng mở rộng — quy hoạch phân kỳ đầu tư.\n\nPhân khu giai đoạn sau thể hiện tầm nhìn dài hạn và khả năng đón ngành công nghiệp mới hoặc mở rộng xưởng hiện hữu. Trình bày nên nêu điều kiện khởi công (lấp đầy giai đoạn 1, chỉ tiêu môi trường…). Ranh và tiến độ thực hiện phụ thuộc quyết định điều chỉnh quy hoạch và thị trường.",
    u: 0.847,
    v: 0.468,
  },
  {
    id: "kcn-fr05-ranh",
    panoIndex: 3,
    title: "Ranh giới KCN & hàng rào",
    description:
      "Minh họa ranh quy hoạch; lưu ý ranh pháp lý lấy theo bản đồ địa chính chính thức.\n\nHàng rào và ranh giới trên phối cảnh giúp người xem định vị nhanh phạm vi KCN so với đất nông nghiệp, giao thông hoặc khu dân cư. Không dùng ảnh để đo đạc ranh; mọi giao dịch cần kiểm tra sổ địa chính và thực địa. Có thể chèn disclaimer pháp lý ngắn ngay dưới hotspot.",
    u: 0.083,
    v: 0.580,
  },
  {
    id: "kcn-fr05-bom",
    panoIndex: 3,
    title: "Trạm bơm & thoát nước mưa",
    description:
      "Hạ tầng thoát nước mưa cục bộ — thông số công suất theo thiết kế.\n\nTrạm bơm và cống thu góp phần chống ngập cho khu vực có nền đất thấp hoặc mật độ xây dựng cao. Marketing có thể nêu dung tích bể ngầm, công suất bơm thiết kế và chế độ vận hành khi mưa lớn. Thông số chi tiết và as-built chỉ dẫn trong hồ sơ thiết kế được duyệt.",
    u: 0.744,
    v: 0.372,
  },
  {
    id: "kcn-fr05-cay",
    panoIndex: 3,
    title: "Vùng cây xanh lớn",
    description:
      "Công viên cây xanh / vùng phủ xanh tập trung — chỉ số cảnh quan KCN.\n\nVùng cây lớn tạo điểm nhấn sinh thái và không gian nghỉ cho người lao động; có thể gắn chỉ số phủ xanh mục tiêu so với thực hiện. Kế hoạch cây xanh nên phối hợp với hệ sinh thái bản địa và bảo trì định kỳ. Hình ảnh minh họa không phản ánh độ tuổi và loài cây thực tế nếu chưa trồng.",
    u: 0.264,
    v: 0.324,
  },
  {
    id: "kcn-top-tong",
    panoIndex: 4,
    title: "Tổng mặt bằng quy hoạch",
    description:
      "Góc nhìn tổng thể KCN Thịnh Minh — quy mô 429,5 ha trong bối cảnh tổ hợp >500 ha (theo tài liệu trình bày).\n\nMặt bằng top view là công cụ mạnh để giải thích cấu trúc tổng thể trước khi zoom vào từng góc phối cảnh Fr. Có thể lớp phủ legend phân khu, đường trục và vùng hạn chế. Mọi con số diện tích và ranh giới phải khớp giấy tờ phê duyệt; ảnh minh họa có thể đơn giản hóa chi tiết địa hình.",
    u: 0.500,
    v: 0.460,
  },
  {
    id: "kcn-top-loi",
    panoIndex: 4,
    title: "Phân khu công nghiệp lõi",
    description:
      "Vùng lô sản xuất chính — mật độ xây dựng, chỉ tiêu sử dụng đất công nghiệp.\n\nPhân khu lõi thường tập trung mật độ cao nhất về nhà xưởng và hạ tầng kỹ thuật; phù hợp nhấn chỉ tiêu FAR, mật độ xây dựng và chiều cao công trình cho phép. Có thể liên kết sang danh mục ngành đã đăng ký hoặc lô còn trống. Thông số cụ thể theo từng thửa trong hồ sơ phân lô.",
    u: 0.375,
    v: 0.564,
  },
  {
    id: "kcn-top-logistics",
    panoIndex: 4,
    title: "Cụm logistics & cổng hàng",
    description:
      "Bố trí kho, bãi container, cổng chính phục vụ vận tải.\n\nCụm logistics trên mặt bằng cần đọc cùng luồng xe nội bộ để tránh nghẽn cổng. Có thể mô tả sơ bộ công năng kho lạnh / kho khô, bãi chờ và khu kiểm hóa. Quy mô và vị trí thực tế theo giai đoạn đầu tư; ảnh top chỉ mang tính định hướng.",
    u: 0.764,
    v: 0.540,
  },
  {
    id: "kcn-top-duong",
    panoIndex: 4,
    title: "Hệ thống đường trục & nút giao",
    description:
      "Mạng đường nội bộ, kết nối cao tốc / quốc lộ — bản đồ giao thông minh họa.\n\nHệ đường trục quyết định khả năng mở rộng phân khu và tiếp cận xe tải trọng lớn. Phù hợp chèn legend cấp đường, nút giao chính và khoảng cách tới tuyến quốc gia. Thiết kế thực tế có thể điều chỉnh theo nghiệm thu từng giai đoạn; không lấy ảnh làm bản đồ đo đạc.",
    u: 0.889,
    v: 0.436,
  },
  {
    id: "kcn-top-dem",
    panoIndex: 4,
    title: "Vùng đệm môi trường",
    description:
      "Cây xanh, khoảng cách cách ly với khu dân cư — cam kết công nghiệp xanh.\n\nVùng đệm môi trường thể hiện khoảng cách an toàn và giảm tác động cảm quan — thường đi kèm chỉ tiêu cây xanh và hành lang bảo vệ. Có thể liên kết tới cam kết ESG hoặc dự án trồng rừng đệm. Hiện trạng cây và đất có thể khác phối cảnh theo tiến độ thi công.",
    u: 0.139,
    v: 0.404,
  },
  {
    id: "kcn-top-cum",
    panoIndex: 4,
    title: "Cụm dịch vụ & hỗ trợ",
    description:
      "Khu dịch vụ, nhà ở chuyên gia, thương mại phụ trợ trong tổ hợp rộng hơn KCN.\n\nCụm dịch vụ hỗ trợ đời sống lao động và logistics “soft”: ăn ở, y tế, ngân hàng, sửa chữa nhẹ. Trên tour 360°, đây là điểm giải thích ranh giới pháp lý giữa đất công nghiệp và đất đô thị / thương mại. Quy hoạch chi tiết và thời điểm triển khai theo chủ trương từng giai đoạn.",
    u: 0.653,
    v: 0.356,
  },
];
