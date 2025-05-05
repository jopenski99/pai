'use client'
import { Button } from "@/components/ui/button";
import rooms from '@/helpers/idb_tables/rooms';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import WaterBillCard from "@/components/pui/water-bill-card";

import React, { useState, useEffect, useRef } from 'react';

export default function Webilling() {
  const [initialized, setInitialized] = useState(false);
  const [roomsList, setRooms] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ room_no: '', renter_name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const newRoomRef = useRef(newRoom);

  useEffect(() => {
    (async () => {
      let db = await rooms.isInitialized();
      setRooms(await rooms.getAll(db.dbIn));
    })();
  }, []);

  const handleDelete = (roomNo) => {
    // Handle deletion logic here
  };

  const handleCreate = () => {
    // Handle creation logic here
    setIsDialogOpen(false);
  };
  const handleSaveRoom = () => {
    setIsLoading(true);
    (async () => {
      let db = await rooms.isInitialized();
      await rooms.create(db.dbIn, newRoomRef.current);
      setIsLoading(false);
      setIsDialogOpen(false);
      setNewRoom({ room_no: '', renter_name: '' });
      setRooms([...roomsList, newRoomRef.current]);
    })();
  }

  const handleInputChange = (e) => {
    newRoomRef.current = { ...newRoomRef.current, [e.target.id]: e.target.value };
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full ">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <WaterBillCard />
          <WaterBillCard />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-4 border border-gray-300 rounded-md"
        />
      </header>
      <main className="w-full grid grid-cols-1 gap-4">


        {roomsList.map((room, index) => (
          <div key={index} className="flex justify-between items-center p-4 border border-gray-300 rounded-md">
            <span>Room {room.room_no} - {room.renter_name}</span>
            <Button
              variant="destructive"
              className="text-xs"
              onClick={() => handleDelete(room.room_no)}
            >
              Delete
            </Button>
          </div>
        ))}
      </main>
      <footer className="w-full flex justify-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add room</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Room</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Renter name
                </Label>
                <Input
                  id="name"
                  value={newRoomRef.current.renter_name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room_number" className="text-right">
                  Assigned room number
                </Label>
                <Input
                  id="room_number"
                  value={newRoomRef.current.room_no}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSaveRoom} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save room"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </footer>

    </div>
  );
}

