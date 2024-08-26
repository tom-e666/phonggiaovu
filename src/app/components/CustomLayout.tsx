'use client';
import React, { useState } from 'react';
import {
    MenuFoldOutlined, MenuUnfoldOutlined,
    HomeOutlined, InfoCircleOutlined,
    UserOutlined, TeamOutlined,
    BookOutlined, DashboardOutlined,
    CalendarOutlined, CheckCircleOutlined,
    LoginOutlined, FileSearchOutlined
} from '@ant-design/icons';
import {Button, Layout, Menu, theme, Image} from 'antd';
import {AuthProvider} from "@/firebase/initFirebase";
import Link from "next/link";

const { Header, Sider, Content } = Layout;

const menuItems = [
    {
        key: '1',
        icon: <HomeOutlined />,
        label: (
            <Link href={"/"} passHref>
                Trang Chủ
            </Link>
        ),
    },
    {
        key: '2',
        icon: <InfoCircleOutlined />,
        label: (
            <Link href={"/about"} passHref>
                Giới Thiệu
            </Link>
        ),
    },
    {
        key: '3',
        icon: <UserOutlined />,
        label: (
            <Link href={"/lecturer"} passHref>
                Giảng Viên
            </Link>
        ),
    },
    {
        key: '4',
        icon: <TeamOutlined />,
        label: (
            <Link href={"/student"} passHref>
                Sinh Viên
            </Link>
        ),
    },
    {
        key: '5',
        icon: <BookOutlined />,
        label: (
            <Link href={"/class"} passHref>
                Lớp Học
            </Link>
        ),
    },
    {
        key: '6',
        icon: <CalendarOutlined />,
        label: (
            <Link href={"/examscheduler"} passHref>
                Lịch Thi
            </Link>
        ),
    },
    {
        key: '7',
        icon: <FileSearchOutlined />,
        label: (
            <Link href={"/examattempt"} passHref>
                Kỳ Thi
            </Link>
        ),
    },
    {
        key: '8',
        icon: <CheckCircleOutlined />,
        label: (
            <Link href={"/eligibilitycheckview"} passHref>
                Xuất học bạ
            </Link>
        ),
    },
    {
        key: '9',
        icon: <DashboardOutlined />,
        label: (
            <Link href={"/dashboard"} passHref>
                Bảng Điều Khiển
            </Link>
        ),
    },
    {
        key: '10',
        icon: <LoginOutlined />,
        label: (
            <Link href={"/login"} passHref>
                Đăng Nhập
            </Link>
        ),
    },
];

interface CustomLayoutProps {
    children: React.ReactNode;
}

const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <AuthProvider>
            <Layout style={{ height: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                    <div className="demo-logo-vertical" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        items={menuItems}
                    />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }}>
                        <div style={{ display: "flex", alignItems: 'center' }}>
                            <Button
                                style={{ width: '64px', height: '64px' }}
                                onClick={() => setCollapsed(!collapsed)}
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            />
                            <div
                                style={{
                                    position: 'relative',
                                    flexGrow: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '64px',
                                }}
                            >
                                <Image width="500px" src="topLogo.png" alt="" />
                            </div>
                        </div>
                    </Header>
                    <Content
                        style={{
                            padding: 24,
                            margin: '24px 16px',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            height: '100vh',
                            overflow:"auto",
                            flexGrow: 1,
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </AuthProvider>
    );
};

export default CustomLayout;
