import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import room_billings from '@/helpers/idb_tables/room_billings';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
interface TenantCardProps {
  roomNo: string;
  renterName: string;
  previousBilling: string; // Replace with appropriate type
  onDelete: (roomNo: string) => void;
}

const TenantCard: React.FC<TenantCardProps> = ({ roomNo, renterName, previousBilling, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [billing, setBilling] = useState({});
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [months] = useState(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
  const toggleExpand = () => setExpanded(!expanded);

  useEffect(() => {
    (async () => {
      let db = await room_billings.isInitialized();
      setBilling(await room_billings.getCurrentBill(db.dbIn));
    })();
  }, []);
  return (
    <div className="pai-card p-3 mb-2 cursor-pointer" onClick={toggleExpand}>
      {isCreateDialogOpen && (
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mb-4">
              Create new billing
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create new billing for room {roomNo}</DialogTitle>
            <DialogDescription>
              Please fill in the required information to create a new billing
            </DialogDescription>
            <div className="space-y-4">
              <Label htmlFor="renter_name" className="mb-1">
                Month of billing
              </Label>
              <Select
                onValueChange={(value) =>
                  setNewBill((prev) => ({ ...prev, month_covered: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a month of bill" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectGroup className="w-full">
                    <SelectLabel>Months</SelectLabel>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Label htmlFor="renter_name" className="mb-1">
                Water Consumption
              </Label>
              <Input id="water_consumed" label="Water consumption" />
              <Label htmlFor="renter_name" className="mb-2">
                Energy Consumption
              </Label>
              <Input id="energy_consumed" label="Energy consumption" />
            </div>
          </DialogContent>
          <DialogFooter>
            <Button variant="primary" onClick={() => setCreateDialogOpen(false)}>
              Save
            </Button>
            <DialogClose asChild>
              <Button variant="outline" className="ml-4">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </Dialog>
      )}
      <div className="flex justify-between items-center">
        <div>
          <p>Room No: {roomNo} | Renter Name: {renterName}</p>
        </div>
        <Button variant="destructive" onClick={() => onDelete(roomNo)} className="ml-4">
          <Trash />
        </Button>
      </div>
      {expanded && (
        <div>
          <div className="font-bold">
            {!Object.keys(billing).length ? (
              <div>
                <p className="text-gray-500">No current billing</p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  Create
                </Button>
              </div>
            ) : (
              <p>Current: {billing.month_covered} - {billing.total_amount}</p>
            )}
          </div>
          <div className="mt-4">
            <p>Previous: {previousBilling}</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default TenantCard;

