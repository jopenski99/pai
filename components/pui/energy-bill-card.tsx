import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import apt_electricity_bills from '@/helpers/idb_tables/apt_electricity_bills';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
export default function EnergyBillCard() {

  const [currentBill, setCurrentBill] = useState({ month_covered: 'March 2025', total_amount: '1100', date_created: '2025-05-05' });
  const [newBill, setNewBill] = useState({billing_no: crypto.randomUUID(), month_covered: '', consumed_kwh: '', energy_rate: '', total_amount: '', date_created: new Date().toISOString().split('T')[0]});
  // setCurrentBill({date: '2025-05-05', amount: '1100'});
  const [months] = useState(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => {
    setIsDialogOpen(true);
  }
  const handleSaveBill = () => {
    setIsLoading(true);
    (async () => {
      if (newBill.total_amount && newBill.consumed_kwh) {
        const waterRate = parseFloat(newBill.total_amount) / parseFloat(newBill.consumed_kwh);
        const waterRateString = isNaN(waterRate) ? '' : waterRate.toFixed(2);
        setNewBill(prevState => ({...prevState, water_rate: waterRateString}));
      }
      let db = await apt_electricity_bills.isInitialized();
      await apt_electricity_bills.create(db.dbIn, newBill);
      await fetchLatestBill();
      setIsLoading(false);
      setIsDialogOpen(false);
      setNewBill({billing_no: crypto.randomUUID(), month_covered: '', energy_rate: '', consumed_kwh: '', total_amount: '', date_created: new Date().toISOString().split('T')[0] });  
    })();
  }
  const handleInputChange = (e) => {
    setNewBill({ ...newBill, [e.target.id]: e.target.value });
  }
   useEffect(() => {
      (async () => {
        await fetchLatestBill();
      })();
  }, []);
  const fetchLatestBill = async () => {
    let db = await apt_electricity_bills.isInitialized();
    let latestBill = await apt_electricity_bills.getLatest(db.dbIn);
    setCurrentBill(latestBill); 
  }
  const formattedCurrentBill = useMemo(() => {
    if (!currentBill) {
      return '';
    }
    return `${(currentBill.month_covered.slice(0, 3) + ' ' + currentBill.date_created.slice(0, 4))} - ₱${currentBill.total_amount}`;
  }, [currentBill]);

  return (
    <div className="pai-card p-4 outline">
      <div className="card-body rounded">
        <h5 className="card-title font-bold text-sm mb-1">Latest Energy Bill</h5>
        <p className="card-text h-12">
          {formattedCurrentBill}
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="text-xs w-full mt-2"
              onClick={() => handleOpen()}
            >
              New Bill
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>add new bill</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-4 py-1">
              <div className="col-span-1">
                Month
              </div>
              <div className="col-span-3">
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
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="consumed_kwh" className="text-right">
                Consumed
              </Label>
              <Input
                id="consumed_kwh"
                placeholder={'00000325'}
                value={newBill.consumed_kwh}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total_amount" className="text-right">
                Total amount
              </Label>
              <Input
                id="total_amount"
                placeholder='1,250.00'
                value={newBill.total_amount}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="w-full text-center gap-4">
            ₱{
             (isNaN(parseFloat(newBill.total_amount)/parseFloat(newBill.consumed_kwh)) ? '0.00' : (parseFloat(newBill.total_amount)/parseFloat(newBill.consumed_kwh)).toFixed(2))
             }/ kWh
              
            </div>
            <DialogFooter>
              <Button type="submit"
                onClick={handleSaveBill} 
                disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Bill"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

