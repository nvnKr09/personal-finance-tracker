import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import React, { useState } from "react";

const AddIncomeModal = ({
  isIncomeModalVisible,
  handleIncomeCancel,
  onFinish,
}) => {

  const [form] = Form.useForm();
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);

  const handleTagChange = (value) => {
    setShowCustomTagInput(value === "other");
  };

  const handleFinish = (values) => {
    if (values.tag === "other" && values.customTag) {
      values.tag = values.customTag;
    }
    onFinish(values, "income");
    form.resetFields();
    setShowCustomTagInput(false);
  };

  return (
    <Modal
      style={{ fontWeight: 600 }}
      open={isIncomeModalVisible}
      title="Add Income"
      onCancel={handleIncomeCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[
            {
              required: true,
              message: "Please input the income amount!",
            },
          ]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            {
              required: true,
              message: "Please select the income date!",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Tag"
          name="tag"
          rules={[
            {
              required: true,
              message: "Please select a tag!",
            },
          ]}
        >
          <Select className="select-input-2" onChange={handleTagChange}>
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>
        {showCustomTagInput && (
          <Form.Item label="Custom Tag" name="customTag" rules={[{required:true, message:"Please enter custom tag!"}]}>
            <Input placeholder="Enter custom tag" />
          </Form.Item>
        )}
        <Form.Item>
          <Button className="btn btn-blue" type="" htmlType="submit">
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddIncomeModal;
