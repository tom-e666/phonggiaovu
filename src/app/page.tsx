import Image from 'next/image';
import React from "react";

const Page=()=>(
    <>
        <Image src={'/bgi.png'} alt={'University of Education'} style={{float: 'right'}} width={800} height={500}/>
        <h1 style={{color: '#2c3e50', fontWeight: 'bold', textAlign: 'center'}}>
            Trang web chính thức của Phòng Giáo Vụ Trường Đại học Sư phạm TP.HCM
        </h1>
        <p style={{fontSize: '18px', lineHeight: '1.6', color: '#34495e'}}>
            <strong>Trường Đại học Sư phạm Thành phố Hồ Chí Minh (HCMUE)</strong> là một trong những cơ sở giáo dục
            <span style={{color: '#3498db', fontWeight: 'bold'}}> uy tín hàng đầu </span>
            tại Việt Nam, chuyên đào tạo và nghiên cứu trong lĩnh vực giáo dục. Với hơn
            <span style={{color: '#3498db', fontWeight: 'bold'}}> 40 năm </span>
            hình thành và phát triển, HCMUE đã
            <span style={{fontStyle: 'italic'}}> khẳng định vị thế </span>
            của mình, không chỉ trong nước mà còn trên trường quốc tế. Trường tự hào là nơi cung cấp
            <span style={{color: '#3498db', fontWeight: 'bold'}}> nguồn nhân lực chất lượng cao </span>,
            góp phần quan trọng vào sự phát triển bền vững của xã hội.
        </p>

    </>
)
export default Page