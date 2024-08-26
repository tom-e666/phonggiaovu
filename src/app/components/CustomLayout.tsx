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
import {Button, Layout, Menu, theme, Image, message} from 'antd';
import app, {AuthProvider} from "@/firebase/initFirebase";
import Link from "next/link";
const { Header, Sider, Content } = Layout;
const menuItems = [
    {
        key: '1',
        icon: <HomeOutlined />,
        label: (
            <Link href={"/"} passHref  prefetch={true}>
                Trang Chủ
            </Link>
        ),
    },
    {
        key: '2',
        icon: <InfoCircleOutlined />,
        label: (
            <Link href={"/about"} passHref  prefetch={true}>
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
            <Link href={"/scoremanagement"} passHref>
                Điểm thi
            </Link>
        ),
    },
    {
        key: '8',
        icon: <CheckCircleOutlined />,
        label: (
            <Link href={"/schoolreport"} passHref>
                Học bạ
            </Link>
        ),
    },
    {
        key: '9',
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
            <Layout style={{ minHeight: '100vh' }}>
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
                            flex: 1,
                            overflow: 'auto',
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
