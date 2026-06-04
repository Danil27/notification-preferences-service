import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { EvaluationResultDto } from './dto/evaluation-result.dto';
import { EvaluationService } from './evaluation.service';

@ApiTags('evaluation')
@Controller('evaluate')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiBody({ type: CreateEvaluationDto })
  @ApiOperation({ summary: 'Evaluate notification delivery permission' })
  @ApiOkResponse({ type: EvaluationResultDto })
  evaluate(
    @Body() createEvaluationDto: CreateEvaluationDto,
  ): Promise<EvaluationResultDto> {
    return this.evaluationService.evaluate(createEvaluationDto);
  }
}
