'use client'
import React from 'react';
import {Button, Spin, Table, Tag, Typography} from 'antd';
import {useAuth} from "@/firebase/initFirebase";
import Link from "next/link";
import Title from "antd/es/typography/Title";

interface EligibilityCriteria {
    id: string;
    name: string;
    requirement: string;
    studentValue: string | number;
    isMet: boolean;
}

interface EligibilityCheckProps {
    studentId: string;
    studentName: string;
    criteria: EligibilityCriteria[];
}

const EligibilityCheckView: React.FC<EligibilityCheckProps> = ({ studentId, studentName, criteria }) => {

    const columns = [
        {
            title: 'Criteria',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
        },
        {
            title: 'Requirement',
            dataIndex: 'requirement',
            key: 'requirement',
            width: '30%',
        },
        {
            title: 'Student Value',
            dataIndex: 'studentValue',
            key: 'studentValue',
            width: '20%',
        },
        {
            title: 'Status',
            dataIndex: 'isMet',
            key: 'isMet',
            width: '10%',
            render: (isMet: boolean) => (
                <Tag color={isMet ? 'green' : 'red'}>
                    {isMet ? 'Met' : 'Not Met'}
                </Tag>
            ),
        },
    ];

    const overallStatus = criteria.every(c => c.isMet) ? 'Eligible' : 'Not Eligible';

    return (
        <div>
            <Typography.Title level={3}>
                Eligibility Check for {studentName} (ID: {studentId})
            </Typography.Title>
            <Table
                dataSource={criteria}
                columns={columns}
                pagination={false}
                rowKey="id"
                bordered
            />
            <Typography.Title level={4} style={{ marginTop: '20px' }}>
                Overall Status: <Tag color={overallStatus === 'Eligible' ? 'green' : 'red'}>{overallStatus}</Tag>
            </Typography.Title>
        </div>
    );
};

// Example usage
const exampleCriteria = [
    { id: '1', name: 'Minimum Average Score', requirement: '>= 60%', studentValue: '75%', isMet: true },
    { id: '2', name: 'Attendance', requirement: '>= 80%', studentValue: '85%', isMet: true },
    { id: '3', name: 'Final Exam Passed', requirement: 'Pass', studentValue: 'Pass', isMet: true },
    { id: '4', name: 'Capstone Project', requirement: 'Completed', studentValue: 'Incomplete', isMet: false },
];

export default function ExampleEligibilityCheck() {
    const {user,loading}= useAuth();
    if(loading)
    {
        return <Spin size="large"/>
    }
    if(!user)
    {
        return (
            <div style={{

                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign:'center',
            }}>
                <Title level={2} style={{marginBottom:'24px',color:'#1677ff'}}>Please login before accessing content</Title>
                <Link href="/dashboard" passHref>
                    <Button type="primary" size="large">Login</Button>
                </Link>
            </div>
        )
    }
    return <EligibilityCheckView studentId="12345" studentName="John Doe" criteria={exampleCriteria} />;
}
