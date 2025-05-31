import { ArithmeticBlock } from '@/components/ArithmeticBlock';
import { ArrayAssignmentBlock } from '@/components/ArrayAssignmentBlock';
import { ArrayDeclarationBlock } from '@/components/ArrayDeclarationBlock';
import { ArrayElementBlock } from '@/components/ArrayElementBlock';
import { AssignmentBlock } from '@/components/AssignmentBlock';
import { ConnectionPoints } from '@/components/ConnectionPoints';
import { EndBlock } from '@/components/EndBlock';
import { ForBlock } from '@/components/ForBlock';
import { FunctionCallBlock } from '@/components/FunctionCallBlock';
import { FunctionEndBlock } from '@/components/FunctionEndBlock';
import { FunctionStartBlock } from '@/components/FunctionStartBlock';
import { IfBlock } from '@/components/IfBlock';
import { OutputBlock } from '@/components/OutputBlock';
import { StartBlock } from '@/components/StartBlock';
import { VariableBlock } from '@/components/VariableBlock';
import { WhileBlock } from '@/components/WhileBlock';
import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { styles } from '../styles';
import { ConnectionPoint, PlacedBlockType } from '../types';

interface WorkspaceBlockProps {
  block: PlacedBlockType
  onUpdatePosition: (instanceId: string, x: number, y: number) => void
  onUpdateBlockData: (instanceId: string, data: any) => void
  onConnectionPointPress: (point: ConnectionPoint) => void
  onDeleteBlock: (instanceId: string) => void
  variables: string[]
  isConnecting: boolean
  activeConnectionPoint?: ConnectionPoint | null
  placedBlocks: PlacedBlockType[]
  errors: { blockId: string; message: string }[] 
  functions: string[]
  arrays: string[]
}

export const WorkspaceBlock = ({
  block,
  onUpdatePosition,
  onUpdateBlockData,
  onConnectionPointPress,
  onDeleteBlock,
  variables,
  isConnecting,
  activeConnectionPoint,
  placedBlocks,
  errors,
  functions,
  arrays,
}: WorkspaceBlockProps) => {
  const offsetX = useSharedValue(block.x)
  const offsetY = useSharedValue(block.y)
  const blockRef = useRef<View>(null)

  const hasError = errors.some((error) => error.blockId === block.instanceId)

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      onUpdatePosition(block.instanceId, offsetX.value, offsetY.value)
    }
  }

  const onGestureEvent = (event: any) => {
    offsetX.value = block.x + event.nativeEvent.translationX
    offsetY.value = block.y + event.nativeEvent.translationY
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 10,
    }
  })

  const hasValueInputConnection =
    (block.type === 'assignment' || block.type === 'output' || block.type === 'arrayAssignment') &&
    block.inputConnections?.valueInputId !== undefined &&
    block.inputConnections?.valueInputId !== null
  const hasLeftInputConnection =
    (block.type === 'if' || block.type === 'while' || block.type === 'for') &&
    block.inputConnections?.leftInputId !== undefined &&
    block.inputConnections?.leftInputId !== null
  const hasRightInputConnection =
    (block.type === 'if' || block.type === 'while' || block.type === 'for') &&
    block.inputConnections?.rightInputId !== undefined &&
    block.inputConnections?.rightInputId !== null

  const hasIndexInputConnection =
    (block.type === 'arrayAssignment' || block.type === 'arrayElement') &&
    block.inputConnections?.indexInputId !== undefined &&
    block.inputConnections?.indexInputId !== null

  const renderBlockContent = () => {
    switch (block.type) {
      case 'start':
        return <StartBlock />
      case 'end':
        return <EndBlock />
      case 'variable':
        return (
          <VariableBlock
            name={block.data?.variableName || ''}
            onNameChange={(name) => onUpdateBlockData(block.instanceId, { variableName: name })}
          />
        )
      case 'assignment':
        return (
          <AssignmentBlock
            variable={block.data?.variableName || ''}
            value={block.data?.value || ''}
            onVariableChange={(name) => onUpdateBlockData(block.instanceId, { variableName: name })}
            onValueChange={(value) => onUpdateBlockData(block.instanceId, { value })}
            variables={variables}
            blockId={block.instanceId}
            valueInputConnected={hasValueInputConnection}
          />
        )
      case 'arithmetic':
        return (
          <ArithmeticBlock
            expression={block.data?.expression || ''}
            onExpressionChange={(expression) => onUpdateBlockData(block.instanceId, { expression })}
            blockId={block.instanceId}
          />
        )
      case 'if':
        return (
          <IfBlock
            condition={block.data?.condition || ''}
            operator={block.data?.operator || '=='}
            onConditionChange={(condition) => onUpdateBlockData(block.instanceId, { condition })}
            onOperatorChange={(operator) => onUpdateBlockData(block.instanceId, { operator })}
            variables={variables}
            blockId={block.instanceId}
            leftInputConnected={hasLeftInputConnection}
            rightInputConnected={hasRightInputConnection}
          />
        )
      case 'while':
        return (
          <WhileBlock
            condition={block.data?.condition || ''}
            operator={block.data?.operator || '=='}
            onConditionChange={(condition) => onUpdateBlockData(block.instanceId, { condition })}
            onOperatorChange={(operator) => onUpdateBlockData(block.instanceId, { operator })}
            variables={variables}
            blockId={block.instanceId}
            leftInputConnected={hasLeftInputConnection}
            rightInputConnected={hasRightInputConnection}
          />
        )
      case 'for':
        return (
          <ForBlock
            initialization={block.data?.initialization || ''}
            condition={block.data?.condition || ''}
            operator={block.data?.operator || '=='}
            iteration={block.data?.iteration || ''}
            onInitializationChange={(initialization: string) => onUpdateBlockData(block.instanceId, { initialization })}
            onConditionChange={(condition: string) => onUpdateBlockData(block.instanceId, { condition })}
            onOperatorChange={(operator: string) => onUpdateBlockData(block.instanceId, { operator })}
            onIterationChange={(iteration: string) => onUpdateBlockData(block.instanceId, { iteration })}
            variables={variables}
            blockId={block.instanceId}
            leftInputConnected={hasLeftInputConnection}
            rightInputConnected={hasRightInputConnection}
          />
        )
      case 'output':
        return (
          <OutputBlock
            expression={block.data?.expression || ''}
            onExpressionChange={(expression: string) => onUpdateBlockData(block.instanceId, { expression })}
            blockId={block.instanceId}
          />
        )
      case 'functionStart':
        return (
          <FunctionStartBlock
            functionName={block.data?.functionName || ''}
            onFunctionNameChange={(name: string) => onUpdateBlockData(block.instanceId, { functionName: name })}
            blockId={block.instanceId}
          />
        )
      case 'functionEnd':
        return <FunctionEndBlock blockId={block.instanceId} />
      case 'functionCall':
        return (
          <FunctionCallBlock
            functionName={block.data?.functionName || ''}
            onFunctionNameChange={(name: string) => onUpdateBlockData(block.instanceId, { functionName: name })}
            availableFunctions={functions}
            blockId={block.instanceId}
          />
        )
      case 'arrayDeclaration':
        return (
          <ArrayDeclarationBlock
            arrayName={block.data?.arrayName || ''}
            arraySize={block.data?.arraySize || ''}
            onArrayNameChange={(name) => onUpdateBlockData(block.instanceId, { arrayName: name })}
            onArraySizeChange={(size) => onUpdateBlockData(block.instanceId, { arraySize: size })}
            blockId={block.instanceId}
          />
        )
      case 'arrayAssignment':
        return (
          <ArrayAssignmentBlock
            arrayName={block.data?.arrayName || ''}
            arrayIndex={block.data?.arrayIndex || ''}
            value={block.data?.value || ''}
            onArrayNameChange={(name) => onUpdateBlockData(block.instanceId, { arrayName: name })}
            onArrayIndexChange={(index) => onUpdateBlockData(block.instanceId, { arrayIndex: index })}
            onValueChange={(value) => onUpdateBlockData(block.instanceId, { value })}
            arrays={arrays}
            blockId={block.instanceId}
            indexInputConnected={hasIndexInputConnection}
            valueInputConnected={hasValueInputConnection}
          />
        )
      case 'arrayElement':
        return (
          <ArrayElementBlock
            arrayName={block.data?.arrayName || ''}
            arrayIndex={block.data?.arrayIndex || ''}
            onArrayNameChange={(name) => onUpdateBlockData(block.instanceId, { arrayName: name })}
            onArrayIndexChange={(index) => onUpdateBlockData(block.instanceId, { arrayIndex: index })}
            arrays={arrays}
            blockId={block.instanceId}
            indexInputConnected={hasIndexInputConnection}
          />
        )
      default:
        return null
    }
  }

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
      <Animated.View
        style={[
          styles.workspaceBlockContainer,
          animatedStyle,
          hasError && styles.errorBlock, 
        ]}
        ref={blockRef}
      >
        {renderBlockContent()}

        <ConnectionPoints
          blockType={block.type || ''}
          blockId={block.instanceId}
          onConnectionPointPress={onConnectionPointPress}
          isConnecting={isConnecting}
          activeConnectionPoint={activeConnectionPoint}
          hasTopConnection={!!block.previousBlockId}
          hasBottomConnection={!!block.nextBlockId}
          hasTrueConnection={!!block.trueBlockId}
          hasFalseConnection={!!block.falseBlockId}
          hasOutputConnection={block.type === 'arithmetic' || block.type === 'arrayElement'}
          hasValueInputConnection={
            block.type === 'assignment' || block.type === 'output' || block.type === 'arrayAssignment'
          }
          hasLeftInputConnection={block.type === 'if' || block.type === 'while' || block.type === 'for'}
          hasRightInputConnection={block.type === 'if' || block.type === 'while' || block.type === 'for'}
          hasIndexInputConnection={block.type === 'arrayAssignment' || block.type === 'arrayElement'}
          valueInputConnected={hasValueInputConnection}
          leftInputConnected={hasLeftInputConnection}
          rightInputConnected={hasRightInputConnection}
          indexInputConnected={hasIndexInputConnection}
        />

        <TouchableOpacity style={styles.deleteBlockButton} onPress={() => onDeleteBlock(block.instanceId)}>
          <Ionicons name='close-circle' size={24} color='#FF5252' />
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  )
}

export default WorkspaceBlock;