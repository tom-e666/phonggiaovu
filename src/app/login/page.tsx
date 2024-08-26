'use client'
import React, { useState } from 'react';
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message } from "antd";
import {
    browserLocalPersistence,
    browserSessionPersistence,
    getAuth,
    setPersistence,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import app from "@/firebase/initFirebase";

type FieldType = {
    email?: string,
    password?: string,
    remember?: boolean,
}

const onFinish: FormProps<FieldType>['onFinish'] = async ({ email, password, remember }) => {
    if (email && password) {
        try {
            const auth = getAuth(app);
            const persistence = remember ? browserLocalPersistence : browserSessionPersistence;
            await setPersistence(auth, persistence);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Đăng nhập thành công', userCredential);
            message.success('Đăng nhập thành công');
        } catch (e) {
            console.error('Đăng nhập thất bại', e);
            message.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
        }
    } else {
        message.error('Email và mật khẩu là bắt buộc!');
    }
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (formProps) => {
    console.log('Đăng nhập thất bại!', formProps);
    message.error('Vui lòng điền đầy đủ thông tin.');
}

const LogoutButton = () => {
    const auth = getAuth(app);
    const handleLogout = async () => {
        try {
            await signOut(auth);
            message.success('Đăng xuất thành công');
        } catch (e) {
            message.error('Đăng xuất thất bại');
        }
    }
    return (
        <Button
            type="primary"
            onClick={handleLogout}
            style={{ marginTop: '20px' }} // Added margin to separate the logout button
        >
            Đăng xuất
        </Button>
    );
}

export default function Page() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
            <div style={{ width: '100%',maxWidth:'600px', padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <Form
                    name="authentication form"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input placeholder="Nhập email của bạn" />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu!" },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu của bạn" />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="remember"
                        valuePropName="checked"
                    >
                        <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Đăng nhập</Button>
                    </Form.Item>
                </Form>
                <LogoutButton />
            </div>
        </div>
    )
}
