import { Button, Checkbox, Flex, Input, Modal, Progress } from "antd";
import { DataType, useStore } from "./zustand";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { handleSubmit, control, reset } = useForm<DataType>();
  const {
    handleSubmit: handleModalSubmit,
    control: modalControl,
    setValue,
  } = useForm<DataType>();

  const { data, addData, removeData, editData } = useStore();
  const [selectedItem, setSelectedItem] = useState<DataType | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const submit = (e: DataType): void => {
    addData({ id: String(Date.now()), text: e.text });
    reset();
  };

  const openEditModal = (item: DataType): void => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setValue("text", item.text);
  };

  const handleEdit = (e: DataType): void => {
    if (selectedItem) {
      editData(selectedItem.id, e.text);
      setIsModalOpen(false);
    }
  };

  const [counter, setCounter] = useState<number>(0);

  // ✅ Checkbox eventini to'g'ri typing qildim
  const onChange = (e: CheckboxChangeEvent, id: string): void => {
    setCheckedItems((prev) => ({ ...prev, [id]: e.target.checked }));
    setCounter((prev) => (e.target.checked ? prev + 1 : prev - 1));
  };

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredData = data.filter((item: DataType) =>
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
            {filteredData.map((value: DataType) => (
              <div
                key={value.id}
                className="py-1 rounded-md px-3 bg-[dodgerblue] text-white flex justify-between items-center"
              >
                <Checkbox
                  onChange={(e) => onChange(e, value.id)} // ✅ Xatoni to‘g‘riladim
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
                    {" "}
                    {/* ✅ `removeData` argumentini to‘g‘riladim */}
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <Input
              placeholder="Search..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />

            <Flex gap="small" wrap className="!mt-3">
              <Progress
                type="circle"
                percent={
                  data.length > 0
                    ? Math.round((counter / data.length) * 100)
                    : 0
                }
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
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
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
