import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Popover, Input, Space, Row, Col, Skeleton } from "antd";
import { ColorResult, SketchPicker } from "react-color";
import { DeepPartial } from "ai";
import { ArtifactSchema } from "@/lib/schema";
import { ExecutionResult } from "@/lib/types";

export default function GradientBackgroundPicker({
  isChatLoading,
  result
}: {
  isChatLoading: boolean
  result?: ExecutionResult
}) {
  const [colors, setColors] = useState(["#ffffff"]); // 默认颜色数组
  const [gradientDirection, setGradientDirection] = useState("to right"); // 渐变方向
  const [visibleColorPicker, setVisibleColorPicker] = useState<number | null>(null); // 控制颜色选择器弹出

  // 更新颜色
  const updateColor = (index: number, newColor: ColorResult) => {
    if (colors.length == 1) {
      setColors([newColor.hex])
    }
    else {
      const updatedColors = [...colors];
      updatedColors[index] = newColor.hex;
      setColors(updatedColors);
    }
  };

  // 添加颜色
  const addColor = () => {
    setColors([...colors, "#000000"]); // 默认新颜色为黑色
  };

  // 删除颜色
  const removeColor = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors);
    // 如果删除的颜色是当前打开的颜色选择器，关闭它
    if (visibleColorPicker === index) {
      setVisibleColorPicker(null);
    }
  };

  // 渐变方向切换
  const handleDirectionChange = (direction: string) => {
    setGradientDirection(direction);
  };

  // 生成渐变样式
  const gradientStyle = {
    background: colors.length === 1
      ? colors[0] // 单色背景
      : `linear-gradient(${gradientDirection}, ${colors.join(", ")})`, // 渐变背景
    width: "100%",
    borderRadius: "4px",
    padding:"20px"
  };

  useEffect(() => {
    console.log(result)
  }, [result])

  return (
    <div className="absolute md:relative top-0 left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y bg-popover h-full w-full overflow-auto">

    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col items-center px-2 pt-1 justify-center">
      <h2>背景颜色选择器</h2>
      <div style={{ marginBottom: "20px" }}>
        <h3>工具栏</h3>
        <Space>
          {/* 添加颜色按钮 */}
          <Button type="primary" onClick={addColor}>
            添加颜色
          </Button>

          {/* 渐变方向选择 */}
          <Button onClick={() => handleDirectionChange("to right")}>
            水平渐变
          </Button>
          <Button onClick={() => handleDirectionChange("to bottom")}>
            垂直渐变
          </Button>
          <Button onClick={() => handleDirectionChange("to top right")}>
            对角渐变
          </Button>
        </Space>
      </div>

      {/* 颜色选择器列表 */}
      <div style={{ marginBottom: "20px" }}>
        <h3>颜色选择</h3>
        <Row gutter={[16, 16]}>
          {colors.map((color, index) => (
            <Col key={index}>
              <Popover
                content={
                  <SketchPicker
                    color={color}
                    onChangeComplete={(newColor) => updateColor(index, newColor)}
                  />
                }
                trigger="click"
                open={visibleColorPicker === index} // 控制当前颜色选择器是否打开
                onOpenChange={(visible) =>
                  setVisibleColorPicker(visible ? index : null)
                }
              >
                <Button
                  style={{
                    backgroundColor: color,
                    border: "1px solid #d9d9d9",
                    width: "40px",
                    height: "40px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // 防止触发全局点击事件
                    setVisibleColorPicker(index); // 打开对应的颜色选择器
                  }}
                />
              </Popover>
              <Button
                type="link"
                danger
                onClick={() => removeColor(index)}
                style={{ display: "block", marginTop: "5px" }}
              >
                删除
              </Button>
            </Col>
          ))}
        </Row>
      </div>

      {/* 展示区域 */}
      <div
        style={{
          width:"70%",
          marginBottom: "20px",
          padding: "20px",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.2)", // 半透明背景
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)", // 模拟浮雕效果
          backdropFilter: "blur(10px)", // 背景模糊
          WebkitBackdropFilter: "blur(10px)", // 兼容 Safari
          border: "1px solid rgba(255, 255, 255, 0.3)", // 边框
        }}
      >
        <h3>背景展示</h3>
        <div style={gradientStyle}>
          <Row gutter={[16, 16]}>
            {/* 左侧商品图片 */}
              <Skeleton.Image  />
            {/* 右侧商品信息 */}
            <Col xs={36} md={12}>
              <Skeleton active paragraph={{ rows: 4 }} />
              {/* 模拟按钮 */}
              <div style={{ marginTop: "16px" }}>
                <Skeleton.Button active style={{ width: "150px", marginRight: "10px" }} />
                <Skeleton.Button active style={{ width: "150px" }} />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};
