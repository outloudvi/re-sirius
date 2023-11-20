import { expect } from "chai"
import { getClassProperties, getEnumProperties } from "./getClassProperties"

it("getClassProperties", function () {
  expect(
    getClassProperties(
      "OneClass",
      `
public class OneClassBlob : IDataObject // TypeDefIndex: 1
{
  [Key(0)]
  public string Trap { get; set; }
}

[MessagePackObject(False)]
public class OneClass : IDataObject // TypeDefIndex: 1
{
	// Fields
	[CompilerGenerated]
	private long <Id>k__BackingField; // 0x01
	[CompilerGenerated]
	private float <DelaySeconds>k__BackingField; // 0x02

	// Properties
	[Key(0)]
	[PrimaryKey(0)]
	public long A { get; set; }
	[Key(1)]
	public long B { get; set; }
	[Key(2)]
	public DateTime C { get; set; }
	[Key(3)]
	public Dex[] D_E { get; set; }
	[Key(7)]
	public Nullable<long> E { get; set; }

  // Garbage

	public void .ctor() { }
}

  `.split("\n")
    )
  ).to.deep.eq([
    {
      index: 0,
      name: "A",
      type: "long",
    },
    {
      index: 1,
      name: "B",
      type: "long",
    },
    {
      index: 2,
      name: "C",
      type: "DateTime",
    },
    {
      index: 3,
      name: "D_E",
      type: "Dex[]",
    },
    {
      index: 7,
      name: "E",
      type: "Nullable<long>",
    },
  ])
})

it("getEnumProperties", function () {
  expect(
    getEnumProperties(
      "OneClass",
      `
public enum OneClass
{
	// Fields
	public int value__; // 0x0
	public const OneClass Abc = 1;
	public const OneClass Def_Ghi = 2;
	public const OneClass Jkl = 5;
}

  `.split("\n")
    )
  ).to.deep.eq([, "Abc", "Def_Ghi", , , "Jkl"])
})
