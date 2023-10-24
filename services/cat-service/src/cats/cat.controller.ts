import { Body, Controller, Get, Header, HttpCode, HttpException, HttpStatus, Param, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { CreateCatDTO } from './DTO/create-cat-dto'
import { Response } from 'express'
import { CatsService } from 'src/cats/cats.service';
import { Cat } from 'src/cats/interfaces/cat.interface';
import { ForbiddenException } from 'src/common/customExceptions/forbidden.exception';

@Controller('cats')
export class CatController {
    constructor(private catsService: CatsService) { }

    // @Post()
    // // @HttpCode(204)
    // @Header('Cache-Control', 'none')
    // create(): string {
    //     return 'This action adds a new cat';
    // }

    // @Get()
    // findAll(): string {
    //     return 'This action returns all cats';
    // }


    // @Get()
    // @Redirect('https://nestjs.com', 301)
    // redirect() { }

    // @Get('docs')
    // @Redirect('https://docs.nestjs.com', 302)
    // getDocs(@Query('version') version) {
    //     if (version && version === '5') {
    //         return { url: 'https://docs.nestjs.com/v5/' };
    //     }
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string): string {
    //     return `This action returns a #${id} cat`;
    // }

    // @Get()
    // async findAll(): Promise<any[]> {
    //     return [];
    // }

    // @Post()
    // async create(@Res() res:Response, @Body() createCatDTO: CreateCatDTO) {
    //     // return 'This action adds a new cat';
    //     res.status(HttpStatus.CREATED).json(createCatDTO);
    // }
    @Post()
    async create(@Body() createCatDTO: CreateCatDTO) {
        this.catsService.create(createCatDTO);
    }

    @Get()
    async findAll(): Promise<Cat[]> {
        // return this.catsService.findAll();

        // Exception
        // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

        // try ... catch block
        // try {
        //     return await this.catsService.findAll()
        // } catch (error) {
        //     throw new HttpException({
        //         status: HttpStatus.FORBIDDEN,
        //         error: 'This is a custom message',
        //     }, HttpStatus.FORBIDDEN, {
        //         cause: error
        //     });
        // }
        
        // CustomExceptions 
        throw new ForbiddenException();
    }
}
