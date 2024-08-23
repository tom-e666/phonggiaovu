'use client'
import React, { useState } from 'react';
import {
    MenuFoldOutlined, MenuUnfoldOutlined,
    UserOutlined, WeiboSquareOutlined
} from '@ant-design/icons';
import {Button, Flex, Layout, Menu, theme,Image} from 'antd';
import {Content, Header} from "antd/es/layout/layout";
import Link from "next/link";
const {Sider}=Layout;


const MenuItem = [
    {
        key: '1',
        icon: <WeiboSquareOutlined />,
        label: (
            <Link href={"/"} passHref>
                Homepage
            </Link>
        ),
    },
    {
        key: '2',
        icon: <WeiboSquareOutlined />,
        label: (
            <Link href={"/about"} passHref>
                About
            </Link>
        ),
    },
    {
        key: '3',
        icon: <WeiboSquareOutlined />,
        label: (
            <Link href={"/lecturer"} passHref>
                Lecturer
            </Link>
        ),
    },
    {
        key: '4',
        icon: <WeiboSquareOutlined />,
        label: (
            <Link href={"/manager"} passHref>
                Manager
            </Link>
        ),
    },
    {
        key: '5',
        icon: <WeiboSquareOutlined />,
        label: (
            <Link href={"/student"} passHref>
                Student
            </Link>
        ),
    },
    {
        key: '6',
        icon: <WeiboSquareOutlined />,
        label: (
            <Link href={"/dashboard"} passHref>
                Dashboard
            </Link>
        ),
    },
    {
        key: '7',
        icon: <WeiboSquareOutlined />,
        label: (
            <Link href={"/class"} passHref>
                Class
            </Link>
        ),
    },
    {
        key: '8',
        icon: <WeiboSquareOutlined />,
        label: (
            <Link href={"/examscheduler"} passHref>
                Exam Scheduler
            </Link>
        ),
    },
    {
        key: '9',
        icon: <WeiboSquareOutlined />,
        label: (
            <Link href={"/examattempt"} passHref>
                Exam Attempt
            </Link>
        ),
    },
    {
        key: '10',
        icon: <WeiboSquareOutlined />,
        label: (
            <Link href={"/eligibilitycheckview"} passHref>
                Eligibility Check
            </Link>
        ),
    },
];
interface CustomLayoutProps {
    children: React.ReactNode;
}
const CustomLayout: React.FC<CustomLayoutProps> = ({children}) =>{
const [collapsed, setCollapsed] = React.useState(false);
const {
    token: { colorBgContainer, borderRadiusLG },
} = theme.useToken();
return (
       <Layout >
           <Sider style={{}} collapsible collapsed={collapsed}>
               <div className="demo-logo-vertical"/>
               <Menu theme="dark"
               mode="inline"
               defaultSelectedKeys={["1"]}
               items={MenuItem}>
               </Menu>
           </Sider>
           <Layout>
               <Header style={{padding:0,background:colorBgContainer }}>
                        <Flex style={{display:"flex",alignItems:'center'}}>
                       <Button
                           style={{width:'64px',height:'64px', }}
                           onClick={() => setCollapsed(!collapsed)}
                           type="text"
                           icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined />}
                       ></Button>
                    <div           style={{
                        position: 'relative',
                        flexGrow: 1, // Make the div take all remaining space
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '64px', // Ensure the height matches the button for alignment
                    }}
                    >
                        <Image width="500px" src="topLogo.png"/>
                    </div>
                        </Flex>
               </Header>
               <Flex>
               <Content
                   style={{
                       padding: 24,
                       margin: '24px 16px',
                       background: colorBgContainer,
                       borderRadius: borderRadiusLG,
                       height:'80vh',
                       flexGrow: 1,
                   }}
               >
                   {children}
               </Content>
               </Flex>
           </Layout>
       </Layout>
);
};

export default CustomLayout;