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
import { BadgeX } from "lucide-react";

import WaterBillCard from "@/components/pui/water-bill-card";
import EnergyBillCard from "@/components/pui/energy-bill-card";

import React, { useState, useEffect, useRef } from 'react';

interface iRoom {
  room_no: string | undefined;
  renter_name: string | undefined;
}

interface WebillingProps {
  rooms: iRoom[]
}
export default function Webilling() {

  const [initialized, setInitialized] = useState(false);
  const [roomsList, setRooms] = useState<iRoom[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoom, setNewRoom] = useState<iRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const newRoomRef = useRef<iRoom>({} as iRoom);

  useEffect(() => {
    (async () => {
      let db = await rooms.isInitialized();
      setRooms(await rooms.getAll(db.dbIn));
    })();
  }, []);

  const handleDelete = (roomNo: string) => {
    setIsLoading(true);
    const confirmed = window.confirm(`Are you sure you want to delete room ${roomNo}?`);
    if (confirmed) {
      (async () => {
        try {
          let db = await rooms.isInitialized();
          await rooms.delete(db.dbIn, roomNo);
          setRooms(await rooms.getAll(db.dbIn));
        } catch (error) {
          console.error('Failed to delete room:', error);
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    // Handle creation logic here
    setIsDialogOpen(false);
  };
  const handleSaveRoom = () => {
    setIsLoading(true);
    try {
      (async () => {
        let db = await rooms.isInitialized();
        console.table(newRoomRef)
        await rooms.create(db.dbIn, newRoom);

      })();
    } catch (error) {
      console.error('Error saving room:', error);
    }
      setIsLoading(false);
      setIsDialogOpen(false);
      setNewRoom({ renter_name:'', room_no: '' }); 
      setRooms([...roomsList, newRoom]);
    }
  

  const handleInputChange = (e) => {
    setNewRoom({ ...newRoom, [e.target.id]: e.target.value });
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-start justify-items-center h-dvh p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full ">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <WaterBillCard />
          <EnergyBillCard />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2  border border-gray-300 rounded-md"
        />
      </header>
      <main className="w-full  grid-cols-1 gap-4 h-9/9" style={{height: '435px', paddingBottom: '10px',paddingRight: '5px',overflow: 'auto'}} >


        {roomsList.map((room, index) => (
          <div key={index} className="h-15 my-2 flex justify-between items-center p-4 border border-gray-300 rounded-md">
            <span>Room {room.room_no} - {room.renter_name}</span>
            <Button
              variant="ghost"
              className="text-xs"
              onClick={() => handleDelete(room.room_no)}
            >
              <BadgeX style={{ width: "25px !important", height: "25px !important", color: "red" }} />
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
                <Label htmlFor="renter_name" className="text-right">
                  Renter name
                </Label>
                <Input
                  id="renter_name"
                  value={newRoom?.renter_name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room_no" className="text- right">
                  Assigned room number
                </Label>
                <Input
                  id="room_no"
                  value={newRoom?.room_no}
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

