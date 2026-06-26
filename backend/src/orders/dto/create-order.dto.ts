import { IsString, IsOptional, IsEmail, IsArray, IsNumber, ValidateNested, IsBoolean, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

class PersonalizationDto {
  @IsOptional() @IsString() name?: string
  @IsOptional() @IsString() number?: string
  @IsOptional() @IsString() font?: string
  @IsOptional() @IsString() nameColor?: string
  @IsOptional() @IsString() numberColor?: string
  @IsOptional() @IsString() nameBorderColor?: string
  @IsOptional() @IsString() numberBorderColor?: string
  @IsOptional() @IsNumber() nameSize?: number
  @IsOptional() @IsNumber() numberSize?: number
  @IsOptional() @IsBoolean() isCaptain?: boolean
  @IsOptional() @IsArray() @IsString({ each: true }) selectedPatches?: string[]
  @IsOptional() @IsArray() @IsString({ each: true }) selectedChampionships?: string[]
}

class OrderItemDto {
  @ApiProperty() @IsString() kitModelId: string
  @ApiProperty() @IsNumber() @Min(1) quantity: number
  @ApiProperty() @IsNumber() @Min(0) unitPrice: number
  @ApiProperty() @IsString() gender: string
  @ApiProperty() @IsString() sleeve: string
  @ApiProperty() @IsString() size: string
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => PersonalizationDto) personalization?: PersonalizationDto
}

class AddressDto {
  @IsString() name: string
  @IsString() street: string
  @IsString() number: string
  @IsOptional() @IsString() complement?: string
  @IsString() neighborhood: string
  @IsString() city: string
  @IsString() state: string
  @IsString() zipCode: string
  @IsOptional() @IsString() country?: string
}

export class CreateOrderDto {
  @ApiPropertyOptional() @IsOptional() @IsEmail() guestEmail?: string
  @ApiProperty() @IsString() paymentMethod: string
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) discountAmount?: number
  @ApiProperty({ type: [OrderItemDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto) items: OrderItemDto[]
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => AddressDto) shippingAddress?: AddressDto
}
