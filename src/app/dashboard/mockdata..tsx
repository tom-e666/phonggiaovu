'use client'
import {addDoc, collection, doc, getDocs, getFirestore, setDoc, updateDoc, writeBatch} from "@firebase/firestore";
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
        <Button style={{marginRight:'10px',marginBottom:'10px'}} type="primary" onClick={uploadRooms}>
            Thêm Phòng Vào Cơ Sở Dữ Liệu
        </Button>
    );
};
const maleNames = [
    "Nguyễn Quốc Hùng",
    "Trần Văn Toán",
    "Phạm Hùng Vĩ",
    "Đinh Đệ",
    "Vũ Đức Vinh",
    "Lộ Hà Đức Lâm",
    "Võ Văn Công",
    "Nguyễn Ngọc Thanh Long",
    "Đào Tiến Lâm",
    "Nguyễn Hữu Tiến Đạt",
    "Hoàng Trần Ngọc Vinh",
    "Nguyễn Tấn Hải",
    "Trần Văn Vinh",
    "Nguyễn Thiên Phúc",
    "Nguyễn Tuấn Khanh",
    "Lưu Minh Cây",
    "Nguyễn Trần Thái Duy",
    "Phan Đức Huy",
    "Phan Văn Lực",
    "Trần Quang Đạo",
    "Nguyễn Nhật Anh",
    "Phan Văn Lực",
    "Phan Trọng Hữu",
    "Bùi Văn Sinh",
    "Mai Hiển Tú",
    "Nguyễn Chí Phú",
    "Trần Thanh Quyền",
    "Đoàn Tấn Phước",
    "Nguyễn Trần Thái Duy",
    "Quách Văn Cương",
    "Nguyễn Trọng Thế Anh",
    "Phan Nhựt Cường",
    "Lý Minh Trung",
    "Hồ Đức Anh",
    "Phạm Hoàng Khang",
    "Lù Xuân Thái",
    "Quách Văn Cương",
    "Quan Chí Khánh An",
    "Cao Tấn Tài",
    "Nguyễn Thành Phước",
    "Nông Tuấn Vũ",
    "Trần Quang Thanh Hưng",
    "Phạm Nhật Nam",
    "Nguyễn Tấn Hải",
    "Ngô Mạnh Cường",
    "Danh Quốc Hào",
    "Nông Tuấn Vũ",
    "Phạm Hoàng Khang",
    "Võ Tấn Toàn",
    "Phan Hữu Trí",
    "Hà Vũ Minh",
    "Lê Thành Nam",
    "Dương Nhật Kha",
    "Đoàn Thanh Hiền",
    "Vũ Văn Long",
    "Phạm Minh Duy",
    "Trịnh Việt Hoàng",
    "Vũ Duy Hồng",
    "Phạm Chí Linh",
    "Nguyễn Đình Trí"
];
const femaleNames = [
    "Dương Ngọc Diễm",
    "Đặng Phương Anh",
    "Trần Thị Hoài",
    "Bùi Thị Phụng",
    "Đỗ Thị Lý",
    "Hàng Thị Tuyết Thời",
    "Châu Trần Anh Thư",
    "Nguyễn Thị Kim Bình",
    "Trần Hồng Linh",
    "Phùng Nữ Thanh Vân",
    "Phạm Thị Cúc",
    "Phùng Thị Ánh Ngọc",
    "Võ Ngọc Chi",
    "Lê Thanh Thơm",
    "Nguyễn Ngọc Ly",
    "Nguyễn Hương Giang",
    "Phạm Thị Hoàng",
    "Nguyễn Thị Kiều Diễm",
    "Trần Thu Hương",
    "Dương Ngọc Diễm",
    "Nguyễn Thị Mỹ Huyền",
    "Huỳnh Thị Bích Tuyền",
    "Nguyễn Thị Xuân Thúy",
    "Nguyễn Xuân Tiên",
    "Phạm Thị Cúc",
    "Danh Thị Kiều Thu",
    "Võ Ngọc Chi",
    "Trần Ngọc Ánh Tuyết",
    "Nguyễn Thúy Đào",
    "Huỳnh Mai Thảo Nguyên",
    "Lại Xuân Quỳnh",
    "Đoàn Thị Lệ Mỹ Tâm",
    "Trần Thuỳ Dương",
    "Đào Thị Thu Thảo",
    "Võ Đức Thi",
    "Dương Thị Tùng",
    "Trần Thị Thuỷ",
    "Trần Thị Bình",
    "Đinh Thị Kim Thùy",
    "Phạm Quỳnh Trang",
    "Thái Thị Hồng Linh",
    "Hồ Ngọc Thanh",
    "Nguyễn Vũ Tú Anh",
    "Tống Mỹ Linh",
    "Trương Thùy Anh",
    "Phạm Thị Thành Tâm",
    "Thạch Thị Ngọc Nhi",
    "Lê Thị Thùy Dương",
    "Trần Trương Nhã Phương",
    "Lại Thị Thúy",
    "Nguyễn Ngọc Ly",
    "Võ Thị Hải Yến",
    "Nguyễn Minh Hằng",
    "Bạch Thị Thu Huyền",
    "Thạch Thị Ngọc Nhi",
    "Trần Trương Nhã Phương",
    "Nguyễn Thị Kim Cúc",
    "Dương Nhật Chi",
    "Lê Thị Hài Hòa",
    "Lê Thị Việt Hà",
    "Trần Thị Thanh Thương",
    "Nguyễn Hồng Nhung",
    "Mai Thị Thúy Hành"
];
const birthDates = [
     "23-03-2004", "15-04-2004", "09-05-2004",
    "18-06-2004", "25-07-2004", "30-08-2004", "11-09-2004", "21-10-2004",
    "03-11-2004", "14-12-2004", "17-01-2004", "25-02-2004", "05-03-2004",
    "08-04-2004", "19-05-2004", "06-06-2004", "12-07-2004", "28-08-2004",
    "07-09-2004", "14-10-2004", "22-11-2004", "03-12-2004", "09-01-2004",
    "28-02-2004", "16-03-2004", "27-04-2004", "30-05-2004", "11-06-2004",
    "19-07-2004", "04-08-2004", "15-09-2004", "25-10-2004", "09-11-2004",
    "19-12-2004", "26-01-2004", "14-02-2004", "20-03-2004", "06-04-2004",
    "13-05-2004", "23-06-2004", "31-07-2004", "16-08-2004", "23-09-2004",
    "02-10-2004", "13-11-2004", "27-12-2004", "03-01-2004", "18-02-2004",
    "28-03-2004", "19-04-2004", "08-05-2004", "14-06-2004", "22-07-2004",
    "05-08-2004", "18-09-2004", "29-10-2004", "17-11-2004", "06-12-2004",
    "11-01-2004", "22-02-2004", "09-03-2004", "30-04-2004", "21-05-2004",
    "12-06-2004", "29-07-2004", "11-08-2004", "26-09-2004", "18-10-2004",
    "25-11-2004", "15-12-2004", "22-01-2004", "10-02-2004", "18-03-2004",
    "07-04-2004", "24-05-2004", "10-06-2004", "03-07-2004", "24-08-2004",
    "02-09-2004", "13-10-2004", "29-11-2004", "13-12-2004", "29-01-2004",
    "19-02-2004", "13-03-2004", "22-04-2004", "17-05-2004", "02-06-2004",
    "15-07-2004", "09-08-2004", "20-09-2004", "01-10-2004", "13-11-2004",
    "27-12-2004", "03-01-2004", "18-02-2004", "28-03-2004", "19-04-2004",
    "08-05-2004", "14-06-2004", "22-07-2004", "05-08-2004", "18-09-2004",
    "29-10-2004", "17-11-2004", "06-12-2004", "11-01-2004", "22-02-2004",
    "09-03-2004", "30-04-2004", "21-05-2004", "12-06-2004", "29-07-2004",
    "11-08-2004", "26-09-2004", "18-10-2004", "25-11-2004", "15-12-2004",
    "22-01-2004", "10-02-2004", "18-03-2004", "07-04-2004", "24-05-2004"
];
const addresses = [
    "456 Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh",
    "789 Nguyễn Thị Minh Khai, Quận 3, TP. Hồ Chí Minh",
    "101 Đinh Tiên Hoàng, Quận Bình Thạnh, TP. Hồ Chí Minh",
    "202 Hai Bà Trưng, Quận 1, TP. Hồ Chí Minh",
    "303 Phạm Ngũ Lão, Quận 1, TP. Hồ Chí Minh",
    "404 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh",
    "505 Lý Tự Trọng, Quận 1, TP. Hồ Chí Minh",
    "606 Trường Chinh, Quận Tân Bình, TP. Hồ Chí Minh",
    "707 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "808 Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh",
    "909 Cách Mạng Tháng 8, Quận 10, TP. Hồ Chí Minh",
    "110 Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh",
    "211 Nguyễn Đình Chiểu, Quận 3, TP. Hồ Chí Minh",
    "312 Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP. Hồ Chí Minh",
    "413 Bùi Thị Xuân, Quận 1, TP. Hồ Chí Minh",
    "514 Bạch Đằng, Quận Bình Thạnh, TP. Hồ Chí Minh",
    "615 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh",
    "716 Hậu Giang, Quận 6, TP. Hồ Chí Minh",
    "817 Quang Trung, Quận Gò Vấp, TP. Hồ Chí Minh",
    "918 Trần Phú, Quận 5, TP. Hồ Chí Minh",
    "119 Lê Văn Sỹ, Quận 3, TP. Hồ Chí Minh",
    "220 Nguyễn Thị Tú, Quận Bình Tân, TP. Hồ Chí Minh",
    "321 Lê Quang Định, Quận Bình Thạnh, TP. Hồ Chí Minh",
    "422 Phan Đăng Lưu, Quận Phú Nhuận, TP. Hồ Chí Minh",
    "523 Nguyễn Thị Định, Quận 2, TP. Hồ Chí Minh",
    "624 Đỗ Xuân Hợp, Quận 9, TP. Hồ Chí Minh",
    "725 Nguyễn Oanh, Quận Gò Vấp, TP. Hồ Chí Minh",
    "826 Lê Văn Lương, Quận 7, TP. Hồ Chí Minh",
    "927 Tôn Đức Thắng, Quận 1, TP. Hồ Chí Minh",
    "128 Trường Sa, Quận Phú Nhuận, TP. Hồ Chí Minh",
    "229 Hoàng Sa, Quận 3, TP. Hồ Chí Minh",
    "330 Kha Vạn Cân, Quận Thủ Đức, TP. Hồ Chí Minh",
    "431 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh",
    "532 Tô Hiến Thành, Quận 10, TP. Hồ Chí Minh",
    "633 Nguyễn Kiệm, Quận Phú Nhuận, TP. Hồ Chí Minh",
    "734 Phạm Văn Đồng, Quận Thủ Đức, TP. Hồ Chí Minh",
    "835 Nguyễn Hữu Thọ, Quận 7, TP. Hồ Chí Minh",
    "936 Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh",
    "137 Đặng Văn Bi, Quận Thủ Đức, TP. Hồ Chí Minh",
    "238 Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh",
    "339 Thành Thái, Quận 10, TP. Hồ Chí Minh",
    "440 Hoàng Văn Thụ, Quận Phú Nhuận, TP. Hồ Chí Minh",
    "541 Phạm Văn Hai, Quận Tân Bình, TP. Hồ Chí Minh",
    "642 Nguyễn Thượng Hiền, Quận 3, TP. Hồ Chí Minh",
    "743 Cao Thắng, Quận 10, TP. Hồ Chí Minh",
    "844 Bùi Viện, Quận 1, TP. Hồ Chí Minh",
    "945 Hùng Vương, Quận 5, TP. Hồ Chí Minh",
    "146 Lê Hồng Phong, Quận 10, TP. Hồ Chí Minh",
    "247 Lê Văn Lương, Quận 7, TP. Hồ Chí Minh",
    "348 Nguyễn Thị Thập, Quận 7, TP. Hồ Chí Minh",
    "449 Trần Hưng Đạo, Quận 1, TP. Hồ Chí Minh",
    "550 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh",
    "651 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "752 Nguyễn Văn Đậu, Quận Bình Thạnh, TP. Hồ Chí Minh",
    "853 Võ Văn Ngân, Quận Thủ Đức, TP. Hồ Chí Minh",
    "954 Cách Mạng Tháng 8, Quận 10, TP. Hồ Chí Minh",
    "155 Trần Bình Trọng, Quận 5, TP. Hồ Chí Minh",
    "256 Nguyễn Hữu Thọ, Quận 7, TP. Hồ Chí Minh",
    "357 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "458 Nguyễn Văn Đậu, Quận Bình Thạnh, TP. Hồ Chí Minh",
    "559 Nguyễn Thượng Hiền, Quận 3, TP. Hồ Chí Minh",
    "660 Lê Văn Sỹ, Quận 3, TP. Hồ Chí Minh",
    "761 Lê Quang Định, Quận Bình Thạnh, TP. Hồ Chí Minh",
    "862 Nguyễn Kiệm, Quận Phú Nhuận, TP. Hồ Chí Minh",
    "963 Trần Quang Khải, Quận 1, TP. Hồ Chí Minh",
    "164 Hoàng Văn Thụ, Quận Tân Bình, TP. Hồ Chí Minh",
    "265 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh",
    "366 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "467 Nguyễn Văn Đậu, Quận Bình Thạnh, TP. Hồ Chí Minh",
    "568 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh",
    "669 Nguyễn Thị Minh Khai, Quận 3, TP. Hồ Chí Minh",
    "770 Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh",
    "871 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "972 Phan Đăng Lưu, Quận Phú Nhuận, TP. Hồ Chí Minh",
    "173 Nguyễn Đình Chiểu, Quận 3, TP. Hồ Chí Minh",
    "274 Nguyễn Thị Thập, Quận 7, TP. Hồ Chí Minh",
    "375 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "476 Phạm Ngọc Thạch, Quận 3, TP. Hồ Chí Minh",
    "577 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "678 Lê Văn Lương, Quận 7, TP. Hồ Chí Minh",
    "779 Trường Chinh, Quận Tân Bình, TP. Hồ Chí Minh",
    "880 Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh",
    "981 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "182 Phạm Văn Đồng, Quận Thủ Đức, TP. Hồ Chí Minh",
    "283 Nguyễn Kiệm, Quận Phú Nhuận, TP. Hồ Chí Minh",
    "384 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "485 Nguyễn Thượng Hiền, Quận 3, TP. Hồ Chí Minh",
    "586 Lê Hồng Phong, Quận 10, TP. Hồ Chí Minh",
    "687 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "788 Trường Chinh, Quận Tân Bình, TP. Hồ Chí Minh",
    "889 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "990 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "191 Phạm Văn Đồng, Quận Thủ Đức, TP. Hồ Chí Minh",
    "292 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh",
    "393 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "494 Nguyễn Văn Đậu, Quận Bình Thạnh, TP. Hồ Chí Minh",
    "595 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "696 Lê Hồng Phong, Quận 10, TP. Hồ Chí Minh",
    "797 Trường Chinh, Quận Tân Bình, TP. Hồ Chí Minh",
    "898 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "999 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "201 Phạm Ngũ Lão, Quận 1, TP. Hồ Chí Minh",
    "302 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh",
    "403 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "504 Nguyễn Văn Đậu, Quận Bình Thạnh, TP. Hồ Chí Minh",
    "605 Lý Tự Trọng, Quận 1, TP. Hồ Chí Minh",
    "706 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "807 Trường Chinh, Quận Tân Bình, TP. Hồ Chí Minh",
    "908 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "1009 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "211 Trần Hưng Đạo, Quận 1, TP. Hồ Chí Minh",
    "312 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh",
    "413 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "514 Nguyễn Văn Đậu, Quận Bình Thạnh, TP. Hồ Chí Minh",
    "615 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh",
    "716 Lê Văn Sỹ, Quận 3, TP. Hồ Chí Minh",
    "817 Trần Hưng Đạo, Quận 1, TP. Hồ Chí Minh",
    "918 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "1019 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "222 Phạm Văn Đồng, Quận Thủ Đức, TP. Hồ Chí Minh",
    "323 Trần Quang Khải, Quận 1, TP. Hồ Chí Minh",
    "424 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    "525 Nguyễn Văn Đậu, Quận Bình Thạnh, TP. Hồ Chí Minh"
];
interface Student {
    id: string;
    name: string;
    email?: string;
    faculty: string;
    birth: string;
    gender?: 'male' | 'female' | 'other';
    phoneNumber?: string;
    address?: string;
    enrolledClasses?: string[];
}
function createStudents() {
    const students = [];
    let studentId = 1;

    for (let i = 0; i < 123; i++) {
        const gender = i % 2 === 0 ? 'male' : 'female';
        const name = gender === 'male' ? maleNames[i % maleNames.length] : femaleNames[i % femaleNames.length];
        const birth = birthDates[i % birthDates.length];
        const address = addresses[i % addresses.length];
        const faculty = "Information Technology"
        const id = `4801104${studentId.toString().padStart(3, '0')}`;

        const student = {
            id,
            name,
            birth,
            gender,
            address,
            faculty,
            enrolledClasses: []
        };

        students.push(student);
        studentId++;
    }

    return students;
}
const studentsList = createStudents();
export const PushStudentsButton = () => {
    const handlePushStudents = async () => {
        try {
            const batch = writeBatch(db);
            const studentCollectionRef = collection(db, 'students');

            studentsList.forEach((student) => {
                const studentDocRef = doc(studentCollectionRef, student.id); // Use student.id as the document ID
                batch.set(studentDocRef, student);
            });

            await batch.commit();
            message.success('Students successfully added to the database!');
        } catch (error) {
            console.error('Error adding students: ', error);
            message.error('Failed to add students to the database.');
        }
    };

    return (
        <div>
            <Button style={{marginRight:'10px',marginBottom:'10px'}} type="primary" onClick={handlePushStudents}>
                push Student
            </Button>
        </div>
    );
};
interface StudentClass {
    id: string;
    name: string;
    take1: number | null;
    take2: number | null;
}

interface Class {
    id: string;
    code: string;
    name: string;
    term: string;
    year: number;
    lecturer?: string;
    lecturerID?: string;
    location?: string;
    schedule?: string[];
    description?: string;
    prerequisites?: string;
    capacity: number;
    students: StudentClass[];
}

const classes: Class[] = [];
const studentClassList: StudentClass[] = [];

// Generate the student class list
for (const st of studentsList) {
    studentClassList.push({
        id: st.id,
        name: st.name,
        take1: Math.floor(Math.random() * 6) + 5,
        take2: Math.floor(Math.random() * 6) + 5,
    });
}

const universalStudent: StudentClass = studentClassList.find(st => st.id === "4801104001") || {
    id: "4801104001",
    name: "Nguyen Van A",
    take1: null,
    take2: null
};

function shuffleArray(array: StudentClass[]): StudentClass[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Shuffle the students list to ensure randomness
shuffleArray(studentClassList);

for (const course of courses) {
    classes.push({
        id: `${course.code}01`,
        code: course.code,
        name: course.name,
        year: 2024,
        term: "03",
        lecturer: "",
        schedule: [],
        capacity: 30,
        location: "Room A101",
        students: []
    });
    classes.push({
        id: `${course.code}02`,
        code: course.code,
        name: course.name,
        year: 2024,
        term: "03",
        schedule: [],
        capacity: 30,
        location: "Room B202",
        students: []
    });
}

// Assign locations and lecturers
let i = 0;
for (const cls of classes) {
    cls.location = rooms[i].id;
    i = (i + 1) % rooms.length;
}

i = 0;
for (const cls of classes) {
    cls.lecturer = lecturers[i].name;
    i = (i + 1) % lecturers.length;
}

// Assign students to classes
for (const cls of classes) {
    // Always add the universal student to each class
    if (universalStudent) {
        cls.students.push(universalStudent);
    }
    shuffleArray(studentClassList); // Re-shuffle to ensure randomness in each class

    for (let j = 0; j < cls.capacity - 1 && j < studentClassList.length; j++) {
        cls.students.push(studentClassList[j]);
    }
}

export const pushClasses = async () => {
    try {
        for (const cls of classes) {
            const docRef = doc(db, "classes", cls.id);
            await setDoc(docRef, cls);
        }
        console.log("Class data added successfully");
    } catch (e) {
        console.log("Failed to add class data", e);
    }
};
const genderTranslation: { [key: string]: string } = {
    male: "Nam",
    female: "Nữ",
};

const facultyTranslation: { [key: string]: string } = {
    "Information Technology": "Công nghệ thông tin",
};
export const UpdateAllStudents = async () => {
        try {
            const batch = writeBatch(db);  // Initialize a batch operation
            const studentCollection = collection(db, "students");
            const studentSnapshot = await getDocs(studentCollection);

            studentSnapshot.docs.forEach((docSnapshot) => {
                const studentData = docSnapshot.data();

                // Translate gender and faculty fields
                const updatedGender = genderTranslation[studentData.gender] || studentData.gender;
                const updatedFaculty = facultyTranslation[studentData.faculty] || studentData.faculty;
                // Create a reference to the document
                const studentRef = doc(db, "students", docSnapshot.id);
                // Batch the update operation
                batch.update(studentRef, {
                    gender: updatedGender,
                    faculty: updatedFaculty,
                });
            });
            await batch.commit();
            console.log("All students updated successfully.");

        } catch (error) {
            console.error("Failed to update students:", error);
        }
};
const generateRandomSchedule = () => {
    const days = ['2', '3', '4', '5', '6', '7']; // Represents Thứ 2 to Thứ 7
    const getRandomTime = () => {
        const hours = Math.floor(Math.random() * 8) + 7; // Random hour between 07 and 14
        const startMinutesOptions = ['00', '20', '40']; // Start minutes options
        const startMinutes = startMinutesOptions[Math.floor(Math.random() * startMinutesOptions.length)];

        const duration = Math.random() < 0.5 ? 60 : 120; // Random duration of either 60 or 120 minutes

        const endHours = Math.floor((hours * 60 + parseInt(startMinutes) + duration) / 60);
        const endMinutes = String((parseInt(startMinutes) + duration) % 60).padStart(2, '0');

        return {
            startTime: `${String(hours).padStart(2, '0')}-${startMinutes}`,
            endTime: `${String(endHours).padStart(2, '0')}-${endMinutes}`,
        };
    };

    const randomDay = days[Math.floor(Math.random() * days.length)];

    const { startTime, endTime } = getRandomTime();

    return `${startTime} - ${endTime} Thứ ${randomDay}`;
};
export const updateClassSchedule = async () => {
    const db = getFirestore();
    const classCollectionRef = collection(db, "classes");

    try {
        const classSnapshot = await getDocs(classCollectionRef);
        const batchUpdates = classSnapshot.docs.map(async (docSnapshot) => {
            const classRef = doc(db, "classes", docSnapshot.id);
            const randomSchedule1 = generateRandomSchedule();
            const randomSchedule2 = generateRandomSchedule();

            return updateDoc(classRef, {
                schedule: [randomSchedule1, randomSchedule2], // Update the schedule array
            });
        });

        await Promise.all(batchUpdates); // Wait for all updates to complete
        console.log('All class schedules updated successfully');
    } catch (error) {
        console.error('Error updating class schedules:', error);
    }
};




















