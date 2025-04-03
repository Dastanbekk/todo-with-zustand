import { Button, Checkbox, Flex, Input, Modal, Progress } from "antd";
import { DataType, useStore } from "./zustand";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import type { CheckboxProps } from "antd";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleSubmit, control, reset } = useForm<DataType>();
  const {
    handleSubmit: handleModalSubmit,
    control: modalControl,
    setValue,
  } = useForm<DataType>();

  const { data, addData, removeData, editData } = useStore();
  const [selectedItem, setSelectedItem] = useState<DataType | null>(null);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  const submit = (e: DataType) => {
    addData({ id: String(Date.now()), text: e.text });
    reset();
  };

  const openEditModal = (item: DataType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setValue("text", item.text);
  };

  const handleEdit = (e: DataType) => {
    if (selectedItem) {
      editData(selectedItem.id, e.text);
      setIsModalOpen(false);
    }
  };

  const [counter, setCounter] = useState(0);
  const onChange: CheckboxProps["onChange"] = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    setCheckedItems((prev) => ({ ...prev, [id]: e.target.checked }));
    setCounter((prev) => (e.target.checked ? prev + 1 : prev - 1));
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-5 w-[60%] mx-auto">
      <div className="py-5 w-[100%] mx-auto">
        <div>
          <form onSubmit={handleSubmit(submit)} className="flex">
            <Controller
              name="text"
              control={control}
              render={({ field }) => (
                <Input {...field} type="text" placeholder="Todo..." />
              )}
            />
            <Button htmlType="submit">Add</Button>
          </form>
        </div>

        <div className="flex mt-2 gap-2">
          <div className="flex flex-col w-full gap-2">
            {filteredData.map((value) => (
              <div
                key={value.id}
                className="py-1 rounded-md px-3 bg-[dodgerblue] text-white flex justify-between items-center"
              >
                <Checkbox
                  onChange={(e) => onChange(e, value.id)}
                  checked={checkedItems[value.id] || false}
                />
                <p
                  className={`${checkedItems[value.id] ? "line-through" : ""}`}
                >
                  {value.text}
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => openEditModal(value)}>Edit</Button>
                  <Button onClick={() => removeData(value.id)} danger>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <Input
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Flex gap="small" wrap className="!mt-3">
              <Progress
                type="circle"
                percent={Math.round((counter / data.length) * 100)}
              />
            </Flex>
          </div>
        </div>
      </div>

      <Modal
        title="Edit Todo"
        open={isModalOpen}
        onOk={handleModalSubmit(handleEdit)}
        onCancel={() => setIsModalOpen(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleModalSubmit(handleEdit);
          }}
        >
          <Controller
            name="text"
            control={modalControl}
            render={({ field }) => <Input {...field} type="text" />}
          />
        </form>
      </Modal>
    </div>
  );
}

export default App;
