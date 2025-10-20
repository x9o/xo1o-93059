-- advanced placement system by xo1o

-- get roblox services
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- set up player references
local player = Players.LocalPlayer
local mouse = player:GetMouse()
local camera = workspace.CurrentCamera

local placementState

-- configuration settings for the placement system
local Config = {
	placementKey = Enum.KeyCode.E,  -- key to toggle placement mode
	rotationKey = Enum.KeyCode.R,   -- key to rotate placed object
	partSwitchKeys = {
		BasePart = Enum.KeyCode.One,   -- switch to regular part
		WedgePart = Enum.KeyCode.Two,  -- switch to wedge part  
		TrussPart = Enum.KeyCode.Three -- switch to truss part
	},
	maxPlacementDistance = 100,     -- how far player can place objects
	gridSize = 1,                   -- snap objects to grid
	rotationIncrement = 90,         -- rotate in 90 degree steps
	tweenDuration = 0.1,            -- smooth rotation animation time
	raycastParams = RaycastParams.new(),
	silhouetteTransparency = 0.7,   -- make preview see-through
	collisionCheckEnabled = true,   -- prevent placing inside other objects
}

-- configure raycasting to ignore player and preview
Config.raycastParams.FilterType = Enum.RaycastFilterType.Exclude

function Config:updateRaycastFilter()
	-- create list of objects to ignore during raycasting
	local filterList = {player.Character}
	-- dont detect the preview silhouette
	if placementState and placementState.silhouette then
		table.insert(filterList, placementState.silhouette)
	end
	self.raycastParams.FilterDescendantsInstances = filterList
end

-- initialize the raycast filter
Config:updateRaycastFilter()

-- placementstate manages the current placement session
local PlacementState = {}
PlacementState.__index = PlacementState

function PlacementState.new()
	local self = setmetatable({}, PlacementState)
	self.isPlacing = false          -- whether were in placement mode
	self.currentRotation = 0        -- current rotation angle
	self.silhouette = nil           -- the preview object
	self.highlight = nil            -- visual feedback for placement
	self.canPlace = false           -- if we can place here
	self.lastPosition = Vector3.new() -- last valid position
	self.targetRotation = 0         -- where we want to rotate to
	self.rotationTween = nil        -- smooth rotation animation
	self.partType = "BasePart"      -- default part type
	return self
end

function PlacementState:cleanup()
	-- clean up the preview object
	if self.silhouette then
		self.silhouette:Destroy()
		self.silhouette = nil
	end
	-- remove the highlight effect
	if self.highlight then
		self.highlight:Destroy()
		self.highlight = nil
	end
	-- stop any active rotation animations
	if self.rotationTween then
		self.rotationTween:Cancel()
		self.rotationTween = nil
	end
	-- reset rotation values
	self.currentRotation = 0
	self.targetRotation = 0

	-- update filter after cleanup
	Config:updateRaycastFilter()
end

placementState = PlacementState.new()

-- helper functions for positioning and rotation
local CFrameUtility = {}

function CFrameUtility.snapToGrid(position, gridSize)
	-- snap position to nearest grid point
	return Vector3.new(
		math.floor(position.X / gridSize + 0.5) * gridSize,
		position.Y,
		math.floor(position.Z / gridSize + 0.5) * gridSize
	)
end

function CFrameUtility.lerpRotation(current, target, alpha)
	--  interpolate between rotations
	local currentCF = CFrame.Angles(0, math.rad(current), 0)
	local targetCF = CFrame.Angles(0, math.rad(target), 0)
	return currentCF:Lerp(targetCF, alpha)
end

-- handles raycasting from mouse position
local RaycastHandler = {}

function RaycastHandler.castFromMouse(params)
	-- cast ray from mouse position into world
	local unitRay = camera:ScreenPointToRay(mouse.X, mouse.Y)
	local direction = unitRay.Direction * Config.maxPlacementDistance

	return workspace:Raycast(unitRay.Origin, direction, params)
end

function RaycastHandler.getValidPlacementPosition()
	-- update filter before raycasting
	Config:updateRaycastFilter()

	-- cast ray and get hit information
	local raycastResult = RaycastHandler.castFromMouse(Config.raycastParams)

	if raycastResult then
		-- snap the hit position to grid
		local snappedPosition = CFrameUtility.snapToGrid(raycastResult.Position, Config.gridSize)
		return snappedPosition, raycastResult.Normal, raycastResult.Instance
	end

	return nil, nil, nil
end

-- checks if placement would collide with other objects
local CollisionDetector = {}

function CollisionDetector.checkOverlap(part)
	-- skip collision check if disabled
	if not Config.collisionCheckEnabled then
		return false
	end

	-- set up overlap detection parameters
	local overlapParams = OverlapParams.new()
	overlapParams.FilterType = Enum.RaycastFilterType.Exclude
	overlapParams.FilterDescendantsInstances = {part, player.Character}

	-- check for overlapping parts in the area
	local region = part.CFrame
	local size = part.Size * 0.99  -- slightly shrink to avoid edge detection issues

	local partsInRegion = workspace:GetPartBoundsInBox(region, size, overlapParams)

	-- check each overlapping part
	for _, overlappingPart in ipairs(partsInRegion) do
		-- ignore terrain, the silhouette itself, and player character
		if overlappingPart ~= part 
			and not overlappingPart:IsDescendantOf(player.Character) 
			and overlappingPart.ClassName ~= "Terrain" then
			return true
		end
	end

	return false
end

-- handles visual feedback for placement
local VisualFeedback = {}

function VisualFeedback.createSilhouette(template)
	-- create a see-through preview object
	local silhouette = template:Clone()
	silhouette.Transparency = Config.silhouetteTransparency
	silhouette.CanCollide = false
	silhouette.Anchored = true
	silhouette.Parent = workspace

	return silhouette
end

function VisualFeedback.createHighlight(parent)
	-- add highlight effect to show placement status
	local highlight = Instance.new("Highlight")
	highlight.FillTransparency = 0.5
	highlight.OutlineTransparency = 0
	highlight.FillColor = Color3.fromRGB(0, 255, 0)
	highlight.OutlineColor = Color3.fromRGB(0, 200, 0)
	highlight.Parent = parent

	return highlight
end

function VisualFeedback.updateHighlightColor(highlight, canPlace)
	-- change color based on placement validity
	if canPlace then
		highlight.FillColor = Color3.fromRGB(0, 255, 0)
		highlight.OutlineColor = Color3.fromRGB(0, 200, 0)
	else
		highlight.FillColor = Color3.fromRGB(255, 0, 0)
		highlight.OutlineColor = Color3.fromRGB(200, 0, 0)
	end
end

-- handles smooth rotation animations
local RotationAnimator = {}

function RotationAnimator.createRotationTween(part, targetRotation, position)
	-- create smooth rotation animation
	local currentCFrame = part.CFrame
	local currentPosition = currentCFrame.Position
	local targetCFrame = CFrame.new(currentPosition) * CFrame.Angles(0, math.rad(targetRotation), 0)

	local tweenInfo = TweenInfo.new(
		Config.tweenDuration,
		Enum.EasingStyle.Quad,
		Enum.EasingDirection.Out
	)

	local tween = TweenService:Create(part, tweenInfo, {CFrame = targetCFrame})
	return tween
end

function RotationAnimator.rotate(state, direction)
	-- rotate the object by specified direction
	state.targetRotation = (state.targetRotation + (Config.rotationIncrement * direction)) % 360

	if state.silhouette and state.lastPosition then
		-- stop current rotation if active
		if state.rotationTween then
			state.rotationTween:Cancel()
		end

		-- create and play new rotation tween
		state.rotationTween = RotationAnimator.createRotationTween(
			state.silhouette,
			state.targetRotation,
			state.lastPosition
		)

		state.rotationTween:Play()
		state.currentRotation = state.targetRotation
	end
end

-- creates template parts for placement
local TemplateCreator = {}

function TemplateCreator.createTemplate(partType)
	-- create different part types based on selection
	local template
	if partType == "BasePart" then
		template = Instance.new("Part")
	elseif partType == "WedgePart" then
		template = Instance.new("WedgePart")
	elseif partType == "TrussPart" then
		template = Instance.new("TrussPart")
	else
		template = Instance.new("Part")  -- fallback to regular part
	end

	-- set part properties
	template.Size = Vector3.new(4, 2, 4)
	template.Material = Enum.Material.SmoothPlastic
	template.Color = Color3.fromRGB(100, 150, 200)
	template.Name = "PlacedObject"

	return template
end

-- main controller for placement system
local PlacementController = {}

function PlacementController.initialize(state)
	-- set up new placement session
	local template = TemplateCreator.createTemplate(state.partType)

	state.silhouette = VisualFeedback.createSilhouette(template)
	state.highlight = VisualFeedback.createHighlight(state.silhouette)
	state.isPlacing = true
	state.currentRotation = 0
	state.targetRotation = 0

	-- update filter after creating silhouette
	Config:updateRaycastFilter()
end

function PlacementController.update(state)
	-- update placement preview every frame
	if not state.isPlacing or not state.silhouette then
		return
	end

	-- get current placement position
	local position, normal, hitPart = RaycastHandler.getValidPlacementPosition()

	if position then
		-- store the raw position for placement
		state.lastPosition = position

		-- offset by half the part height to sit on the surface (for visual only)
		local adjustedPosition = position + Vector3.new(0, state.silhouette.Size.Y / 2, 0)

		local targetCFrame = CFrame.new(adjustedPosition) * CFrame.Angles(0, math.rad(state.currentRotation), 0)

		-- only update position if not currently rotating
		if not state.rotationTween or state.rotationTween.PlaybackState ~= Enum.PlaybackState.Playing then
			state.silhouette.CFrame = targetCFrame
		end

		-- check if placement is valid here
		state.canPlace = not CollisionDetector.checkOverlap(state.silhouette)
		VisualFeedback.updateHighlightColor(state.highlight, state.canPlace)
	else
		-- cant place if no valid position
		state.canPlace = false
		VisualFeedback.updateHighlightColor(state.highlight, false)
	end
end

function PlacementController.place(state)
	-- place the object in the world
	if not state.canPlace then
		return
	end

	if not state.lastPosition then
		return
	end

	-- create the final placed part
	local newPart = TemplateCreator.createTemplate(state.partType)

	-- use lastposition (raw) and add the offset for proper placement
	local adjustedPosition = state.lastPosition + Vector3.new(0, newPart.Size.Y / 2, 0)

	newPart.CFrame = CFrame.new(adjustedPosition) * CFrame.Angles(0, math.rad(state.currentRotation), 0)
	newPart.Parent = workspace

	-- play placement sound effect
	local placeSound = Instance.new("Sound")
	placeSound.SoundId = "rbxassetid://180163738"
	placeSound.Volume = 0.5
	placeSound.Parent = newPart
	placeSound:Play()

	game:GetService("Debris"):AddItem(placeSound, 2)
end

function PlacementController.toggle(state)
	-- toggle placement mode on/off
	if state.isPlacing then
		state:cleanup()
		state.isPlacing = false
	else
		PlacementController.initialize(state)
	end
end

-- handles user input with debouncing
local InputHandler = {}
InputHandler.debounce = {}

function InputHandler.isDebounced(key)
	-- check if key input is still on cooldown
	return InputHandler.debounce[key] and tick() - InputHandler.debounce[key] < 0.1
end

function InputHandler.setDebounce(key)
	-- set debounce timer for key
	InputHandler.debounce[key] = tick()
end

function InputHandler.handleKeyPress(input, state)
	-- handle keyboard inputs for placement system
	if input.KeyCode == Config.placementKey and not InputHandler.isDebounced("placement") then
		InputHandler.setDebounce("placement")
		PlacementController.toggle(state)
	elseif input.KeyCode == Config.rotationKey and state.isPlacing and not InputHandler.isDebounced("rotation") then
		InputHandler.setDebounce("rotation")
		RotationAnimator.rotate(state, 1)
	elseif input.KeyCode == Config.partSwitchKeys.BasePart and not InputHandler.isDebounced("partSwitch") then
		InputHandler.setDebounce("partSwitch")
		state.partType = "BasePart"
		if state.isPlacing then
			state:cleanup()
			PlacementController.initialize(state)
		end
	elseif input.KeyCode == Config.partSwitchKeys.WedgePart and not InputHandler.isDebounced("partSwitch") then
		InputHandler.setDebounce("partSwitch")
		state.partType = "WedgePart"
		if state.isPlacing then
			state:cleanup()
			PlacementController.initialize(state)
		end
	elseif input.KeyCode == Config.partSwitchKeys.TrussPart and not InputHandler.isDebounced("partSwitch") then
		InputHandler.setDebounce("partSwitch")
		state.partType = "TrussPart"
		if state.isPlacing then
			state:cleanup()
			PlacementController.initialize(state)
		end
	end
end

function InputHandler.handleMouseClick(state)
	-- handle mouse click to place object
	if state.isPlacing and state.canPlace then
		PlacementController.place(state)
	end
end

-- connect input events
UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then 
		return  -- ignore input if gui is focused
	end
	InputHandler.handleKeyPress(input, placementState)
end)

mouse.Button1Down:Connect(function()
	InputHandler.handleMouseClick(placementState)
end)

-- update placement preview every frame
RunService.RenderStepped:Connect(function()
	PlacementController.update(placementState)
end)

-- reset when player respawns
player.CharacterAdded:Connect(function(character)
	Config:updateRaycastFilter()
	placementState:cleanup()
	placementState.isPlacing = false
end)

-- simple performance monitoring
local PerformanceMonitor = {}
PerformanceMonitor.frameCount = 0
PerformanceMonitor.lastCheck = tick()

function PerformanceMonitor.update()
	PerformanceMonitor.frameCount += 1

	if tick() - PerformanceMonitor.lastCheck >= 1 then
		PerformanceMonitor.frameCount = 0
		PerformanceMonitor.lastCheck = tick()
	end
end

RunService.RenderStepped:Connect(PerformanceMonitor.update)
