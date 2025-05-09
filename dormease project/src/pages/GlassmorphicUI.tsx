
import React, { useState } from "react";
import { GlassButton } from "../components/ui/glass-button";
import { GlassCard } from "../components/ui/glass-card";
import { GlassNavbar } from "../components/ui/glass-navbar";
import { GlassDialogContent } from "../components/ui/glass-dialog-content";
import { GlassDropdownContent } from "../components/ui/glass-dropdown-content";
import { Dialog, DialogTrigger, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem } from "../components/ui/dropdown-menu";
import { Separator } from "../components/ui/separator";
import { ArrowRight, Menu, Settings, User, LogOut } from "lucide-react";

const GlassmorphicUI: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 text-white">
      <GlassNavbar className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Glassmorphic UI</h2>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <GlassButton variant="dark" size="icon">
                <Menu className="h-5 w-5" />
              </GlassButton>
            </DropdownMenuTrigger>
            <GlassDropdownContent variant="dark">
              <DropdownMenuItem className="flex items-center gap-2">
                <User size={16} /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Settings size={16} /> Settings
              </DropdownMenuItem>
              <Separator className="my-1 bg-white/10" />
              <DropdownMenuItem className="flex items-center gap-2 text-red-400">
                <LogOut size={16} /> Logout
              </DropdownMenuItem>
            </GlassDropdownContent>
          </DropdownMenu>
        </div>
      </GlassNavbar>

      <main className="container mx-auto py-16 px-4 space-y-12">
        <section className="space-y-8">
          <h1 className="text-4xl font-bold text-center mb-8">Glassmorphic UI Components</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <GlassCard>
              <h3 className="text-xl font-semibold mb-4">Glass Card</h3>
              <p className="mb-4">This is a standard glass card with subtle transparency and blur effects.</p>
              <GlassButton>Regular Button</GlassButton>
            </GlassCard>
            
            <GlassCard variant="dark">
              <h3 className="text-xl font-semibold mb-4">Dark Glass Card</h3>
              <p className="mb-4">A darker variant of the glass card with the same effects.</p>
              <GlassButton variant="dark">Dark Button</GlassButton>
            </GlassCard>
            
            <GlassCard glow={true}>
              <h3 className="text-xl font-semibold mb-4">Glowing Glass Card</h3>
              <p className="mb-4">This card has an additional glowing border effect.</p>
              <GlassButton glow={true}>Glowing Button</GlassButton>
            </GlassCard>
            
            <GlassCard variant="dark" glow={true}>
              <h3 className="text-xl font-semibold mb-4">Dark Glowing Card</h3>
              <p className="mb-4">A combination of dark variant with glow effect.</p>
              <div className="flex space-x-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <GlassButton variant="dark" glow={true}>
                      Open Dialog
                    </GlassButton>
                  </DialogTrigger>
                  <GlassDialogContent variant="dark" glow={true}>
                    <DialogTitle>Glassmorphic Dialog</DialogTitle>
                    <DialogDescription>
                      This is a dialog with glassmorphic effects applied.
                    </DialogDescription>
                    <div className="flex justify-end mt-4">
                      <GlassButton variant="dark" onClick={() => setIsDialogOpen(false)}>
                        Close
                      </GlassButton>
                    </div>
                  </GlassDialogContent>
                </Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <GlassButton variant="dark" glow={true}>
                      Dropdown <ArrowRight className="ml-2 h-4 w-4" />
                    </GlassButton>
                  </DropdownMenuTrigger>
                  <GlassDropdownContent variant="dark" glow={true}>
                    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuItem>Help</DropdownMenuItem>
                  </GlassDropdownContent>
                </DropdownMenu>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GlassmorphicUI;
