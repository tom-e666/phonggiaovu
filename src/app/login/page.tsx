'use client'
import React, { useState } from 'react';
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message } from "antd";
import {
    browserLocalPersistence,
    browserSessionPersistence,
    getAuth,
    setPersistence,
    signInWithEmailAndPassword, signOut
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
            console.log('Authentication success', userCredential);
            message.success('Authentication successful. Redirecting to the home page...');
        } catch (e) {
            console.error('Authentication failed', e);
            message.error('Authentication failed. Please check your credentials.');
        }
    } else {
        message.error('email and password are required!');
    }
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (formProps) => {
    console.log('Authentication failed!', formProps);
    message.error('Please complete the form correctly.');
}
const LogoutButton=()=>{
    const auth = getAuth(app);
    const handleLogout= async ()=>{
        try{
            await signOut(auth);
            message.success('Logged out successfully');
        }catch (e){
            message.error('Failed to log out');
        }
    }
    return <Button
        type="primary"
        onClick={handleLogout}
    >Logout</Button>
}
export default function Page() {
    return (
        <>
            <Form
                name="authentication form"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 800 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please input your email!" },
                        { type: 'email', message: 'The input is not a valid email!' } // Ensures username is a valid email
                    ]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: "Please input your password!" },
                        { min: 6, message: 'Password must be at least 6 characters long!' } // Ensures a minimum password length
                    ]}
                >
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>
                <Form.Item<FieldType>
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{ offset: 8, span: 16 }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Form.Item
                    wrapperCol={{ offset: 8, span: 16 }}
                >
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
            <LogoutButton/>
            <p>aa@gmail.com</p>
            <p>aaaaaa</p>

        </>
    )
}
