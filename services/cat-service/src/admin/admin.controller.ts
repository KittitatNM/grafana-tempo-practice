import { Controller, Get, HostParam } from '@nestjs/common';

// @Controller('admin')
@Controller({ host: ':admin.example.com' })
export class AdminController {
    @Get()
    // index(): string {
    //     return 'Admin page';
    // }
    getInfo(@HostParam('account') account: string) {
        return account;
    }
}
