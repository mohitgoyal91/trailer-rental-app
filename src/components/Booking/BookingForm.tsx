"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BookingFormData {
  trailerType: string;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  deliveryLocation: string;
  notes: string;
}

interface BookingFormProps {
  onSubmit?: (data: BookingFormData & { pricing: PricingInfo }) => void;
}

interface PricingInfo {
  dailyRate: number;
  totalDays: number;
  subtotal: number;
  deposit: number;
  total: number;
}

export function BookingForm({ onSubmit }: BookingFormProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormData>();
  
  const trailerType = watch('trailerType');

  // Mock pricing based on trailer type
  const getPricing = (type: string, days: number): PricingInfo => {
    const rates: Record<string, number> = {
      'utility': 25,
      'cargo': 35,
      'flatbed': 45,
      'enclosed': 55,
      'car-hauler': 65,
    };
    
    const dailyRate = rates[type] || 25;
    const subtotal = dailyRate * days;
    const deposit = Math.round(subtotal * 0.5); // 50% deposit
    
    return {
      dailyRate,
      totalDays: days,
      subtotal,
      deposit,
      total: subtotal + deposit,
    };
  };

  const calculateDays = (start: Date, end: Date): number => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const pricing = startDate && endDate && trailerType 
    ? getPricing(trailerType, calculateDays(startDate, endDate))
    : null;

  const onFormSubmit = async (data: BookingFormData) => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (!pricing) {
      toast.error('Please select a trailer type');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bookingData = {
        ...data,
        startDate,
        endDate,
        pricing,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSubmit?.(bookingData);
      toast.success('Booking request submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit booking request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Book a Trailer</CardTitle>
        <CardDescription>
          Fill out the details below to request a trailer rental
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Trailer Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="trailerType">Trailer Type</Label>
            <Select onValueChange={(value) => setValue('trailerType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select trailer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utility">Utility Trailer - $25/day</SelectItem>
                <SelectItem value="cargo">Cargo Trailer - $35/day</SelectItem>
                <SelectItem value="flatbed">Flatbed Trailer - $45/day</SelectItem>
                <SelectItem value="enclosed">Enclosed Trailer - $55/day</SelectItem>
                <SelectItem value="car-hauler">Car Hauler - $65/day</SelectItem>
              </SelectContent>
            </Select>
            {errors.trailerType && (
              <p className="text-sm text-red-600">Please select a trailer type</p>
            )}
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {startDate ? format(startDate, 'PPP') : 'Pick start date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {endDate ? format(endDate, 'PPP') : 'Pick end date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < (startDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Location Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pickupLocation">Pickup Location</Label>
              <Input
                id="pickupLocation"
                placeholder="Enter pickup address"
                {...register('pickupLocation', { required: 'Pickup location is required' })}
              />
              {errors.pickupLocation && (
                <p className="text-sm text-red-600">{errors.pickupLocation.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryLocation">Delivery Location (Optional)</Label>
              <Input
                id="deliveryLocation"
                placeholder="Enter delivery address or leave blank for pickup only"
                {...register('deliveryLocation')}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or notes for the owner"
              rows={3}
              {...register('notes')}
            />
          </div>

          {/* Pricing Summary */}
          {pricing && (
            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Pricing Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Daily Rate:</span>
                  <span>${pricing.dailyRate}/day</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Days:</span>
                  <span>{pricing.totalDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal (Non-refundable):</span>
                  <span>${pricing.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit (Refundable):</span>
                  <span>${pricing.deposit}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Cash Payment:</span>
                  <span>${pricing.total}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  * Payment will be collected in cash upon pickup. Deposit will be refunded after trailer return.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isSubmitting || !startDate || !endDate || !trailerType}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting Request...</span>
              </div>
            ) : (
              'Submit Booking Request'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
