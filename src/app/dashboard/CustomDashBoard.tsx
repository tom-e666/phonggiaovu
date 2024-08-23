import {Button, Checkbox, Form, Input} from "antd";
import FormItem from "antd/es/form/FormItem";

const DashBoard=()=>{
    return (
        <Form style={{margin:"8%"}}>
            <Form.Item
            label="userName"
            name="User Name"
            initialValue="Load later"
            ><Input type="text" placeholder="Password" disabled={true} />
            </Form.Item>
            <Form.Item
                label="Password"
                name="Password"
                initialValue="Load later"
            >
                <Input type="password" placeholder="Password" disabled={true} />
            </Form.Item>
            <Form.Item
                label="userName"
                name="User Name"
                initialValue="Load later"
            ></Form.Item>


        </Form>



    )
}
export default DashBoard;
