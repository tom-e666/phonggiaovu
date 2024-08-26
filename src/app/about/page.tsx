import {Button, Space, DatePicker, version} from "antd";
import {FaReact} from "react-icons/fa";
import {SiTypescript,SiNextdotjs} from "react-icons/si";
const Page =()=> (
    <div style={{overflow:'hidden',overflowY:'hidden'}}>
        <h1>Hệ thống thông tin dành cho phòng giáo vụ</h1>
        <p>Được phát triển dựa trên React, TypeScript và Next.Js</p>
        <p> Thông tin chi tiết vui lòng liên hệ <a href={'tom@gmail.com'}>tom@gmail.com</a></p>
        <p> Source code available at <a href={'repo'} target={"_blank"}>Github</a></p>
        <div style={{fontSize: '50px', marginTop: '20px'}}>
            <FaReact title="React" style={{color: '#61DBFB', marginRight: '20px'}}/>
            <SiTypescript title="TypeScript" style={{color: '#007ACC', marginRight: '20px'}}/>
            <SiNextdotjs title="Next.js" style={{color: '#000000', marginRight: '20px'}}/>
        </div>
        <h2 style={{ marginTop:'50px'}}>MIT License</h2>
        <p>Copyright (c) 2024 HCMUE</p>
            <p>Permission is hereby granted, free of charge, to any person obtaining a
                copy of this software and associated documentation files (the &quot;Software&quot;),
                to deal in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions: </p>

            <p>The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.</p>

            <p>THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
            </p>
    </div>
)
export default Page