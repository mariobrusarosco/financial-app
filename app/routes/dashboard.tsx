import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/domains/ui-system/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/domains/ui-system/components/avatar';
import { Calendar } from '@/domains/ui-system/components/calendar';
import { Input } from '@/domains/ui-system/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/domains/ui-system/components/select';
import {
  Users,
  TrendingUp,
  Target,
  PlusCircle,
  MessageSquare,
  Minus,
  Plus,
} from 'lucide-react';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Header can be added here if needed */}
      <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 md:p-10">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Overview of your income.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$15,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
              <div className="h-[200px] w-full mt-4 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-12 w-12 text-rose-500" />
                <span className="ml-2 text-muted-foreground">Line Chart Placeholder</span>
              </div>
            </CardContent>
          </Card>



          {/* <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Invite your team members to collaborate.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <TeamMemberItem name="Sofia Davis" email="m@example.com" role="Owner" avatarSrc="https://i.pravatar.cc/150?u=sofia" />
              <TeamMemberItem name="Jackson Lee" email="p@example.com" role="Member" avatarSrc="https://i.pravatar.cc/150?u=jackson" />
              <TeamMemberItem name="Isabella Nguyen" email="i@example.com" role="Member" avatarSrc="https://i.pravatar.cc/150?u=isabella" />
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Move Goal</CardTitle>
              <CardDescription>Set your daily activity goal.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 rounded-full">
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-5xl font-bold tracking-tighter">200</div>
                  <div className="text-[0.70rem] uppercase text-muted-foreground">
                    Calories/day
                  </div>
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 rounded-full">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
              <div className="h-[100px] w-full mb-4 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-lg flex items-center justify-center">
                <Target className="h-8 w-8 text-rose-500" />
                <span className="ml-2 text-muted-foreground">Activity Chart Placeholder</span>
              </div>
              <Button className="w-full" variant="default">Set Goal</Button>
            </CardContent>
          </Card>

          {/* <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Hi, how can I help you today?
                </CardTitle>
                <CardDescription>
                  Our support team is here for you.
                </CardDescription>
              </div>
              <Button size="icon" variant="outline" className="ml-auto rounded-full">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-6 text-sm">
                <ChatMessage sender="user" message="Hey, I'm having trouble with my account." />
                <ChatMessage sender="support" message="What seems to be the problem?" />
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <form className="flex w-full items-center space-x-2">
                <Input id="message" placeholder="Type your message..." className="flex-1" autoComplete="off" />
                <Button type="submit" size="icon">
                  <PlusCircle className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardFooter>
          </Card> */}
          
          {/* <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Exercise Minutes</CardTitle>
              <CardDescription>
                Your exercise minutes are ahead of where you normally are.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[150px] w-full mt-4 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-10 w-10 text-rose-500" />
                    <span className="ml-2 text-muted-foreground">Exercise Chart</span>
                </div>
            </CardContent>
          </Card> */}

        </div>
      </main>
    </div>
  );
}

// interface TeamMemberItemProps {
//   name: string;
//   email: string;
//   role: 'Owner' | 'Member';
//   avatarSrc: string;
// }

// function TeamMemberItem({ name, email, role, avatarSrc }: TeamMemberItemProps) {
//   return (
//     <div className="flex items-center justify-between space-x-4">
//       <div className="flex items-center space-x-4">
//         <Avatar>
//           <AvatarImage src={avatarSrc} />
//           <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
//         </Avatar>
//         <div>
//           <p className="text-sm font-medium leading-none">{name}</p>
//           <p className="text-sm text-muted-foreground">{email}</p>
//         </div>
//       </div>
//       <Select defaultValue={role.toLowerCase()}>
//         <SelectTrigger className="ml-auto w-[110px]">
//           <SelectValue placeholder="Select" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="owner">Owner</SelectItem>
//           <SelectItem value="member">Member</SelectItem>
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }

// interface ChatMessageProps {
//     sender: 'user' | 'support';
//     message: string;
//   }
  
// function ChatMessage({ sender, message }: ChatMessageProps) {
//     const isUser = sender === 'user';
//     return (
//       <div className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : ''}`}>
//         {!isUser && (
//           <Avatar className="h-8 w-8">
//             <AvatarImage src="https://i.pravatar.cc/150?u=support" />
//             <AvatarFallback>SP</AvatarFallback>
//           </Avatar>
//         )}
//         <div
//           className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 rounded-xl ${isUser ? 'bg-rose-500 text-white rounded-e-xl rounded-es-xl' : 'bg-gray-100 dark:bg-gray-700 rounded-ss-xl rounded-se-xl'}`}
//         >
//           <p className="text-sm font-normal">{message}</p>
//         </div>
//         {isUser && (
//           <Avatar className="h-8 w-8">
//             <AvatarImage src="https://i.pravatar.cc/150?u=currentuser" />
//             <AvatarFallback>ME</AvatarFallback>
//           </Avatar>
//         )}
//       </div>
//     );
//   }
