'use client'
import {addDoc, collection, doc, setDoc} from "@firebase/firestore";
import {db} from "@/firebase/initFirebase";
import {Button, message} from "antd";

interface Course {
    code: string;            // Course code, e.g., "COMP1010"
    name: string;            // Course name, e.g., "Lập trình cơ bản"
    isCompulsory: boolean;   // Indicates if the course is compulsory
    credits: number;         // Number of credits for the course
}

const courses:Course[] = [
    {
        code: "COMP1800",
        name: "Cơ sở toán trong Công nghệ thông tin",
        isCompulsory: true,
        credits: 4.00,
    },
    {
        code: "MILI2701",
        name: "Đường lối quốc phòng và an ninh của Đảng Cộng sản Việt Nam",
        isCompulsory: true,
        credits: 3.00,
    },
    {
        code: "PHYL2401",
        name: "Giáo dục thể chất 1 (Thể dục - Điền kinh)",
        isCompulsory: false, // Tự Chọn = Optional
        credits: 1.00,
    },
    {
        code: "COMP1010",
        name: "Lập trình cơ bản",
        isCompulsory: true,
        credits: 3.00,
    },
    {
        code: "POLI1903",
        name: "Pháp luật đại cương",
        isCompulsory: true,
        credits: 2.00,
    },
    {
        code: "PSYC1001",
        name: "Tâm lý học đại cương",
        isCompulsory: true,
        credits: 2.00,
    },
    {
        code: "COMP1802",
        name: "Thiết kế web",
        isCompulsory: true,
        credits: 2.00,
    },
    {
        code: "COMP1801",
        name: "Toán rời rạc và ứng dụng",
        isCompulsory: true,
        credits: 2.00,
    },
    {
        code: "POLI2001",
        name: "Triết học Mác – Lênin",
        isCompulsory: true,
        credits: 3.00,
    },
    {
        code: "POLI2003",
        name: "Chủ nghĩa xã hội khoa học",
        isCompulsory: true,
        credits: 2.00
    },
    {
        code: "MILI2702",
        name: "Công tác quốc phòng và an ninh",
        isCompulsory: true,
        credits: 2.00
    },
    {
        code: "DOMS0",
        name: "Giáo dục đối sống",
        isCompulsory: false,
        credits: 2.00
    },
    {
        code: "PHYL2405",
        name: "Giáo dục Thể chất 2 - Aerobic cơ bản",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2406",
        name: "Giáo dục Thể chất 2 - Bơi lội cơ bản",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2402",
        name: "Giáo dục Thể chất 2 - Bóng chuyền cơ bản",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2408",
        name: "Giáo dục Thể chất 2 - Bóng đá cơ bản",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2407",
        name: "Giáo dục Thể chất 2 - Bóng rổ cơ bản",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2403",
        name: "Giáo dục Thể chất 2 - Cầu lông cơ bản",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2410",
        name: "Giáo dục Thể chất 2 - Đá cầu cơ bản",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2409",
        name: "Giáo dục Thể chất 2 - Khiêu vũ thể thao cơ bản",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2409",
        name: "Giáo dục Thể chất 2 - Teakwondo cơ bản",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "POLI2002",
        name: "Kinh tế chính trị Mác - Lênin",
        isCompulsory: true,
        credits: 2.00
    },
    {
        code: "PSYC2801",
        name: "Kỹ năng làm việc nhóm và tư duy sáng tạo",
        isCompulsory: false,
        credits: 2.00
    },
    {
        code: "PSYC2803",
        name: "Kỹ năng thuyết trình và giải quyết vấn đề",
        isCompulsory: false,
        credits: 2.00
    },
    {
        code: "COMP1013",
        name: "Lập trình hướng đối tượng",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "COMP1013",
        name: "Lập trình nâng cao",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "EDUC2801",
        name: "Phương pháp học tập hiệu quả",
        isCompulsory: false,
        credits: 2.00
    },
    {
        code: "PSYC2804",
        name: "Phương pháp nghiên cứu khoa học",
        isCompulsory: true,
        credits: 2.00
    },

    {
        code: "COMP1016",
        name: "Cấu trúc dữ liệu",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "COMP1018",
        name: "Cơ sở dữ liệu",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "PHYL2414",
        name: "Giáo dục Thể chất 3 - Bóng rổ nâng cao",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2415",
        name: "Giáo dục Thể chất 3 - Aerobic nâng cao",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2416",
        name: "Giáo dục Thể chất 3 - Bơi lội nâng cao",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2411",
        name: "Giáo dục Thể chất 3 - Bóng chuyền nâng cao",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2417",
        name: "Giáo dục Thể chất 3 - Bóng đá nâng cao",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2418",
        name: "Giáo dục Thể chất 3 - Cầu lông nâng cao",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2416",
        name: "Giáo dục Thể chất 3 - Đá cầu nâng cao",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2419",
        name: "Giáo dục Thể chất 3 - Khiêu vũ thể thao nâng cao",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "PHYL2418",
        name: "Giáo dục Thể chất 3 - Teakwondo nâng cao",
        isCompulsory: false,
        credits: 1.00
    },
    {
        code: "COMP1019",
        name: "Lập trình trên Windows",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "COMP1701",
        name: "Lý thuyết đồ thị và ứng dụng",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "MILI2703",
        name: "Quân sự học",
        isCompulsory: true,
        credits: 2.00
    },
    {
        code: "POLI2005",
        name: "Tư tưởng Hồ Chí Minh",
        isCompulsory: true,
        credits: 2.00
    },
    {
        code: "COMP1501",
        name: "Xác suất thống kê và ứng dụng",
        isCompulsory: true,
        credits: 3.00
    },

    {
        code: "COMP1332",
        name: "Hệ điều hành",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "COMP1011",
        name: "Kiến trúc máy tính và hợp ngữ",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "MILI2704",
        name: "Kỹ thuật chiến đấu bộ binh và chiến thuật",
        isCompulsory: true,
        credits: 4.00
    },
    {
        code: "POLI2004",
        name: "Lịch sử Đảng cộng sản Việt Nam",
        isCompulsory: true,
        credits: 2.00
    },
    {
        code: "COMP1015",
        name: "Nhập môn mạng máy tính",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "COMP1401",
        name: "Phân tích và thiết kế giải thuật",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "COMP1502",
        name: "Quy hoạch tuyến tính và ứng dụng",
        isCompulsory: true,
        credits: 3.00
    },

    {
        code: "COMP1024",
        name: "Các hệ cơ sở dữ liệu",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1041",
        name: "Cơ sở dữ liệu nâng cao",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1043",
        name: "Hệ thống mã nguồn mở",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1709",
        name: "Hệ thống nhúng và ứng dụng",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1712",
        name: "Học máy",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1307",
        name: "Kiểm thử phần mềm cơ bản",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1804",
        name: "Lập trình Python",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1071",
        name: "Nghi thức giao tiếp mạng (CISCO 1)",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1044",
        name: "Nhập môn công nghệ phần mềm",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "COMP1060",
        name: "Phân tích thiết kế hướng đối tượng",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "COMP1032",
        name: "Phân tích và thiết kế hệ thống thông tin",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "COMP1304",
        name: "Phát triển ứng dụng trên thiết bị di động",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1308",
        name: "Phát triển ứng dụng trò chơi",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1305",
        name: "Quản lý dự án Công nghệ Thông tin",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1309",
        name: "Quản trị cơ bản với Windows Server",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1204",
        name: "Quy trình phát triển phần mềm Agile",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1032",
        name: "Thiết kế và quản lý mạng LAN",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1314",
        name: "Trí tuệ nhân tạo",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "COMP1050",
        name: "Xử lý ảnh số",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1311",
        name: "Bảo mật cơ sở dữ liệu",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1049",
        name: "Bảo mật và an ninh mạng",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1713",
        name: "Các giải thuật tính toán đại số",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1046",
        name: "Các hệ cơ sở tri thức",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1318",
        name: "Các phương pháp học thống kê",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1075",
        name: "Chuẩn đoán và quản lý sự cố mạng",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1065",
        name: "Chuyên đề Oracle",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1710",
        name: "Công nghệ khối và ứng dụng",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1042",
        name: "Công nghệ JAVA",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1041",
        name: "Công nghệ NET",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1031",
        name: "Công nghệ Web",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1074",
        name: "Định tuyến mạng nâng cao (CISCO 2)",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1073",
        name: "Đồ họa máy tính",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1085",
        name: "Hệ thống quản trị doanh nghiệp",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1310",
        name: "Hệ tư vấn thông tin",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1506",
        name: "Internet vạn vật",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1315",
        name: "Khai thác dữ liệu và ứng dụng",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1313",
        name: "Khai thác dữ liệu văn bản",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1326",
        name: "Lắp ráp, cài đặt và bảo trì máy tính",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1803",
        name: "Lập trình PHP",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "COMP1316",
        name: "Lập trình tiến hóa và thuật giải di truyền",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1705",
        name: "Logic mờ và ứng dụng",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1716",
        name: "Lý thuyết mã hóa và mật mã",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1025",
        name: "Mạng máy tính nâng cao",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1704",
        name: "Nhập môn DevOps",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1077",
        name: "Quản trị dịch vụ mạng với Windows Server",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1076",
        name: "Quản trị mạng với Linux",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1809",
        name: "Thực hành nghề nghiệp",
        isCompulsory: true,
        credits: 3.00
    },
    {
        code: "COMP1807",
        name: "Truyền thông kỹ thuật số",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1306",
        name: "Xây dựng dự án Công nghệ thông tin",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1715",
        name: "Xử lý ngôn ngữ tự nhiên",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1080",
        name: "Công nghệ mạng không dây",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1069",
        name: "Công nghệ phần mềm nâng cao",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1313",
        name: "Điện toán đám mây",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1320",
        name: "Đồ họa máy tính nâng cao",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "PSYC2803",
        name: "Khởi nghiệp",
        isCompulsory: true,
        credits: 2.00
    },
    {
        code: "COMP1309",
        name: "Kiểm thử phần mềm nâng cao",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1325",
        name: "Máy học nâng cao",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1505",
        name: "Phân tích ảnh y khoa",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1324",
        name: "Phân tích dữ liệu lớn",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1703",
        name: "Phát triển ứng dụng trên thiết bị di động nâng cao",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1504",
        name: "Thị giác máy tính và ứng dụng",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1410",
        name: "Thực tập nghề nghiệp 1",
        isCompulsory: true,
        credits: 2.00
    },
    {
        code: "COMP1084",
        name: "Thương mại điện tử",
        isCompulsory: false,
        credits: 3.00
    },

    {
        code: "COMP1813",
        name: "Hồ sơ tốt nghiệp",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1083",
        name: "Khóa luận tốt nghiệp",
        isCompulsory: false,
        credits: 6.00
    },
    {
        code: "COMP1814",
        name: "Sản phẩm nghiên cứu",
        isCompulsory: false,
        credits: 3.00
    },
    {
        code: "COMP1811",
        name: "Thực tập nghề nghiệp 2",
        isCompulsory: true,
        credits: 5.00
    }
                

];
export const pushCourse= async ()=>{
    try{
         for(const course of courses) {
             const docRef = await addDoc(collection(db, "courses"), course);
             console.log("Document written with ID: ", docRef.id);
         }
    }catch (e){
        console.log("Error adding document: courses ", e);
    }
}
interface Lecturer {
    id: string;
    name: string;
    email: string;
    birth:string,
    faculty:string,
}
const lecturers: Lecturer[] = [
    {
        id: "comp0",
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        birth: "1980-01-01",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp1",
        name: "Trần Thị B",
        email: "tranthib@example.com",
        birth: "1985-05-05",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp2",
        name: "Lê Thị C",
        email: "lethic@example.com",
        birth: "1978-09-09",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp3",
        name: "Phạm Văn D",
        email: "phamvand@example.com",
        birth: "1990-03-21",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp4",
        name: "Võ Thị E",
        email: "vothie@example.com",
        birth: "1987-11-15",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp5",
        name: "Đặng Văn F",
        email: "dangvanf@example.com",
        birth: "1982-07-07",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp6",
        name: "Bùi Thị G",
        email: "buithig@example.com",
        birth: "1983-02-02",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp7",
        name: "Hoàng Văn H",
        email: "hoangvanh@example.com",
        birth: "1991-12-12",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp8",
        name: "Phan Thị I",
        email: "phanthii@example.com",
        birth: "1989-08-08",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp9",
        name: "Ngô Văn K",
        email: "ngovank@example.com",
        birth: "1993-04-04",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp10",
        name: "Nguyễn Thị L",
        email: "nguyenthil@example.com",
        birth: "1975-03-03",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp11",
        name: "Trần Văn M",
        email: "tranvanm@example.com",
        birth: "1988-06-06",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp12",
        name: "Lê Văn N",
        email: "levann@example.com",
        birth: "1992-01-01",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp13",
        name: "Vũ Thị O",
        email: "vuthio@example.com",
        birth: "1979-10-10",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp14",
        name: "Phạm Thị P",
        email: "phamthip@example.com",
        birth: "1986-11-11",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp15",
        name: "Võ Văn Q",
        email: "vovanq@example.com",
        birth: "1981-09-09",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp16",
        name: "Đặng Thị R",
        email: "dangthir@example.com",
        birth: "1994-07-07",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp17",
        name: "Bùi Văn S",
        email: "buivans@example.com",
        birth: "1984-12-12",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp18",
        name: "Hoàng Thị T",
        email: "hoangthit@example.com",
        birth: "1977-02-02",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "comp19",
        name: "Ngô Thị U",
        email: "ngothiu@example.com",
        birth: "1980-05-05",
        faculty: "Công nghệ Thông tin"
    },
    {
        id: "eng1",
        name: "Nguyễn Thị Anh",
        email: "nguyenthianh@example.com",
        birth: "1985-05-10",
        faculty: "Anh văn"
    },
    {
        id: "eng2",
        name: "Trần Văn Bình",
        email: "tranvanbinh@example.com",
        birth: "1988-08-15",
        faculty: "Anh văn"
    },
    {
        id: "eng3",
        name: "Lê Thị Cúc",
        email: "lethicuc@example.com",
        birth: "1990-03-20",
        faculty: "Anh văn"
    },
    {
        id: "eng4",
        name: "Phạm Văn Đào",
        email: "phamvandao@example.com",
        birth: "1982-11-05",
        faculty: "Anh văn"
    },
    {
        id: "eng5",
        name: "Võ Thị Lan",
        email: "vothilan@example.com",
        birth: "1978-02-02",
        faculty: "Anh văn"
    },
    {
        id: "eng6",
        name: "Đặng Thị Mai",
        email: "dangthimai@example.com",
        birth: "1981-09-09",
        faculty: "Anh văn"
    },
    {
        id: "eng7",
        name: "Bùi Văn Nhật",
        email: "buivannhat@example.com",
        birth: "1992-07-17",
        faculty: "Anh văn"
    },
    {
        id: "eng8",
        name: "Hoàng Thị Oanh",
        email: "hoangthioanh@example.com",
        birth: "1993-12-12",
        faculty: "Anh văn"
    },
    {
        id: "eng9",
        name: "Phan Văn Phúc",
        email: "phanvanphuc@example.com",
        birth: "1986-06-06",
        faculty: "Anh văn"
    },
    {
        id: "eng10",
        name: "Ngô Thị Quỳnh",
        email: "ngothiquynh@example.com",
        birth: "1991-04-04",
        faculty: "Anh văn"
    }
];
export const pushLecturer= async ()=>{
    try{
        for(const lecturer of lecturers){
            const docRef= doc(db,"lecturers", lecturer.id);
            await setDoc(docRef,lecturer);
        }
        console.log("Lecturer created");
    }catch (error){
        console.log("error pushing data",error);
    }
}

interface Room{
    id:string;
    destination?:string;
    capacity?:string;
    occupation?:string[];
}
const rooms: Room[] = [];
for (let i = 1; i < 6; ++i) {
    for (let j = 0; j < 20; ++j) {
        let t = `A${i}`;
        if (j > 9) {
            t += j;
        } else {
            t += `0${j}`;
        }
        rooms.push({ id: t });
    }
}
for (let i = 1; i < 6; ++i) {
    for (let j = 0; j < 20; ++j) {
        let t = `B${i}`;
        if (j > 9) {
            t += j;
        } else {
            t += `0${j}`;
        }
        rooms.push({ id: t });
    }
}
export const pushRoom=async ()=>{
    try{
        for(const room of rooms){
            const docRef= doc(db,"rooms",room.id);
            await setDoc(docRef,room)
            console.log("Document written with ID: ", docRef.id);
        }
    }catch (error){
        console.log('add document failed',error);
    }
}
interface Class  {
    id: string;
    code:string;
    name:string;
    term: string;
    year:number;
    lecturer?: string;
    lecturerID?:string;
    location?:string;
    schedule?: string[];
    description?: string;
    prerequisites?:string;
    capacity?:number;
}
const classes:Class[]=[];
for (const course of courses) {
    classes.push({
        id: `${course.code}01`,
        code: course.code,
        name: course.name,
        year:2024,
        term: "03",
        lecturer: "Dr. John Doe", // Example lecturer
        schedule: [], // Example schedule
        capacity: 30, // Example capacity
        location: "Room A101", // Example location
    });
    classes.push({
        id: `${course.code}02`, // Unique ID for the second class
        code: course.code,
        name: course.name,
        year:2024,
        term: "03", // This should be dynamic if necessary
        schedule: [], // Example schedule
        capacity: 30, // Example capacity
        location: "Room B202", // Example location
    });

    let i=0;
    for(const cls of classes){
        cls.location=rooms[i].id;
        i=(i+1)%rooms.length;
    }
    i=0;
    for(const cls of classes){
        cls.lecturer=lecturers[i].name;
        i=(i+1)%20;
    }
}
export const pushClasses=async ()=>{
    try{
        for(const cls of classes){
            const docRef=doc(db,"classes",cls.id);
            await setDoc(docRef,cls);
        }
        console.log("add class success");
    }catch (e){
        console.log("add class failed",e);
    }
}

export const UploadRoomsButton: React.FC = () => {
    const rooms = [
        { id: "B100" },
        { id: "B101" },
        { id: "B102" },
        { id: "B103" },
    ];

    const uploadRooms = async () => {
        try {
            for (const room of rooms) {
                await addDoc(collection(db, "availableRooms"), room);
            }
            message.success("Phòng đã được thêm vào cơ sở dữ liệu thành công!");
        } catch (error) {
            console.error("Failed to upload rooms:", error);
            message.error("Không thể thêm phòng vào cơ sở dữ liệu.");
        }
    };

    return (
        <Button type="primary" onClick={uploadRooms}>
            Thêm Phòng Vào Cơ Sở Dữ Liệu
        </Button>
    );
};










