"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface TrailerRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  trailerType: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  deliveryLocation?: string;
  status: 'pending' | 'approved' | 'denied' | 'completed';
  pricing: {
    dailyRate: number;
    totalDays: number;
    subtotal: number;
    deposit: number;
    total: number;
  };
  notes?: string;
  createdAt: string;
  ownerResponse?: string;
}

interface TrailerRequestCardProps {
  request: TrailerRequest;
  onStatusUpdate: (requestId: string, status: 'approved' | 'denied', response?: string) => void;
}

export function TrailerRequestCard({ request, onStatusUpdate }: TrailerRequestCardProps) {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDenyDialogOpen, setIsDenyDialogOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTrailerType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = async () => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onStatusUpdate(request.id, 'approved', response || 'Your booking request has been approved!');
      setIsApproveDialogOpen(false);
      setResponse('');
      toast.success('Booking request approved successfully!');
    } catch (error) {
      toast.error('Failed to approve booking request');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeny = async () => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onStatusUpdate(request.id, 'denied', response || 'Your booking request has been denied.');
      setIsDenyDialogOpen(false);
      setResponse('');
      toast.success('Booking request denied');
    } catch (error) {
      toast.error('Failed to deny booking request');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {formatTrailerType(request.trailerType)} Request
            </CardTitle>
            <CardDescription>
              From {request.customerName} • {formatDate(request.startDate)} - {formatDate(request.endDate)}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(request.status)}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Customer Information */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Customer Details</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {request.customerName}</p>
            <p><span className="font-medium">Email:</span> {request.customerEmail}</p>
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Pickup Location</h4>
            <p className="text-sm">{request.pickupLocation}</p>
          </div>
          {request.deliveryLocation && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700">Delivery Location</h4>
              <p className="text-sm">{request.deliveryLocation}</p>
            </div>
          )}
        </div>

        {/* Pricing Information */}
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Earnings Breakdown</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span>Daily Rate:</span>
            <span>${request.pricing.dailyRate}/day</span>
            <span>Total Days:</span>
            <span>{request.pricing.totalDays} days</span>
            <span>Your Earnings:</span>
            <span>${request.pricing.subtotal}</span>
            <span>Customer Deposit:</span>
            <span>${request.pricing.deposit}</span>
            <span className="font-semibold text-green-700">Total Payment:</span>
            <span className="font-semibold text-green-700">${request.pricing.total}</span>
          </div>
        </div>

        {/* Customer Notes */}
        {request.notes && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Customer Notes</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{request.notes}</p>
          </div>
        )}

        {/* Owner Response */}
        {request.ownerResponse && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Your Response</h4>
            <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">{request.ownerResponse}</p>
          </div>
        )}

        {/* Action Buttons */}
        {request.status === 'pending' && (
          <div className="flex space-x-3 pt-4">
            <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  Approve Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Approve Booking Request</DialogTitle>
                  <DialogDescription>
                    You are about to approve this booking request from {request.customerName}.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="approve-response">Message to Customer (Optional)</Label>
                    <Textarea
                      id="approve-response"
                      placeholder="Add any special instructions or welcome message..."
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsApproveDialogOpen(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isUpdating ? 'Approving...' : 'Approve Request'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isDenyDialogOpen} onOpenChange={setIsDenyDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  Deny Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deny Booking Request</DialogTitle>
                  <DialogDescription>
                    You are about to deny this booking request from {request.customerName}.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deny-response">Reason for Denial (Optional)</Label>
                    <Textarea
                      id="deny-response"
                      placeholder="Let the customer know why the request was denied..."
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDenyDialogOpen(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeny}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Denying...' : 'Deny Request'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Request Date */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          Requested on {formatDate(request.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}
