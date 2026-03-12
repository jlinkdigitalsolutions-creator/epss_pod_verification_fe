import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/layout/Logo';
import { Spinner } from '@/components/ui/spinner';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';
import { Lock, User, BadgeCheck } from 'lucide-react';

export function DelivererLogin({ deliverer, onSave }) {
  const [form, setForm] = useState(deliverer);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: null, id: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = (form.name ?? '').trim();
    const id = (form.id ?? '').trim();
    const newErrors = {
      name: name ? null : 'Username is required',
      id: id ? null : 'Staff ID is required',
    };
    setErrors(newErrors);
    if (newErrors.name || newErrors.id) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      onSave({ ...form, name, id, status: 'accepted' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <AnimatedBackground />

      <div id="main-content" className="relative z-10 w-full max-w-[420px]">
        <div className="rounded-2xl border-2 border-border bg-card shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20 focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2 focus-within:ring-offset-background group">
          <div className="px-8 py-8 border-b border-border bg-muted/20">
            <div className="flex justify-center">
              <Logo size="lg" className="justify-center" />
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center leading-relaxed">
              Receiving voucher · Drugs, reagents & medical supplies
            </p>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-focus-within:scale-105">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Sign in</h2>
                <p className="text-sm text-muted-foreground">Enter your deliverer credentials</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter username"
                  value={form.name}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, name: e.target.value }));
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                  }}
                  leftIcon={<User className="h-4 w-4" />}
                  className="h-12 rounded-xl"
                  autoComplete="username"
                  disabled={loading}
                  error={errors.name}
                  required
                />
                {errors.name && (
                  <p id="name-error" className="text-xs text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="id" className="text-sm font-medium">
                  Staff ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="id"
                  placeholder="Enter staff ID"
                  value={form.id}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, id: e.target.value }));
                    if (errors.id) setErrors((prev) => ({ ...prev, id: null }));
                  }}
                  leftIcon={<BadgeCheck className="h-4 w-4" />}
                  className="h-12 rounded-xl"
                  autoComplete="off"
                  disabled={loading}
                  error={errors.id}
                  required
                />
                {errors.id && (
                  <p id="id-error" className="text-xs text-destructive">
                    {errors.id}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-xl font-medium mt-1 shadow-md hover:shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="md" className="border-primary-foreground border-t-transparent" />
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
