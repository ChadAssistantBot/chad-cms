import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import Modal from "../components/Modal";

const Tasks = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Tasks</h1>
            <Card>
                <div className="flex gap-4 mb-4">
                    <Input placeholder="Enter a new task..." className="flex-grow" />
                    <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white hover:bg-blue-700">
                        Add Task
                    </Button>
                </div>
                <div className="space-y-4">
                     <p className="text-gray-500">No tasks found. Add a new task to get started!</p>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Task">
                <p>Add a new task here!</p>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => setIsModalOpen(false)} className="bg-blue-600 text-white">Save</Button>
                </div>
            </Modal>
        </div>
    );
};

export default Tasks;
