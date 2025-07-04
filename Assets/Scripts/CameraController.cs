using UnityEngine;

/// <summary>
/// Camera controller for navigating the 3D VTM city map
/// Provides smooth movement and rotation controls similar to city-building games
/// </summary>
public class CameraController : MonoBehaviour
{
    [Header("Movement Settings")]
    [SerializeField] private float moveSpeed = 10f;
    [SerializeField] private float fastMoveSpeed = 20f;
    [SerializeField] private float mouseSensitivity = 2f;
    [SerializeField] private float scrollSensitivity = 2f;
    
    [Header("Rotation Settings")]
    [SerializeField] private float rotationSpeed = 100f;
    [SerializeField] private float minVerticalAngle = -80f;
    [SerializeField] private float maxVerticalAngle = 80f;
    
    [Header("Zoom Settings")]
    [SerializeField] private float zoomSpeed = 10f;
    [SerializeField] private float minZoomHeight = 5f;
    [SerializeField] private float maxZoomHeight = 500f;
    
    [Header("Boundaries")]
    [SerializeField] private bool useBoundaries = true;
    [SerializeField] private Vector2 boundaryMin = new Vector2(-1000f, -1000f);
    [SerializeField] private Vector2 boundaryMax = new Vector2(1000f, 1000f);
    
    private Camera cam;
    private Vector3 lastMousePosition;
    private bool isRotating = false;
    private bool isPanning = false;
    private float currentRotationX = 0f;
    private float currentRotationY = 0f;
    
    private void Awake()
    {
        cam = GetComponent<Camera>();
        if (cam == null)
            cam = Camera.main;
    }
    
    private void Start()
    {
        // Initialize rotation values based on current camera rotation
        Vector3 eulerAngles = transform.eulerAngles;
        currentRotationY = eulerAngles.y;
        currentRotationX = eulerAngles.x;
        
        // Normalize the x rotation to be between -180 and 180
        if (currentRotationX > 180f)
            currentRotationX -= 360f;
    }
    
    private void Update()
    {
        HandleKeyboardInput();
        HandleMouseInput();
        HandleScrollWheel();
    }
    
    private void HandleKeyboardInput()
    {
        Vector3 moveDirection = Vector3.zero;
        
        // Get input
        float horizontal = Input.GetAxis("Horizontal"); // A/D keys
        float vertical = Input.GetAxis("Vertical");     // W/S keys
        
        // Calculate movement relative to camera rotation
        Vector3 forward = transform.forward;
        Vector3 right = transform.right;
        
        // Remove Y component for ground-based movement
        forward.y = 0f;
        right.y = 0f;
        forward.Normalize();
        right.Normalize();
        
        moveDirection = forward * vertical + right * horizontal;
        
        // Handle vertical movement
        if (Input.GetKey(KeyCode.Q) || Input.GetKey(KeyCode.E))
        {
            if (Input.GetKey(KeyCode.Q))
                moveDirection += Vector3.down;
            if (Input.GetKey(KeyCode.E))
                moveDirection += Vector3.up;
        }
        
        // Apply movement
        if (moveDirection != Vector3.zero)
        {
            float currentSpeed = Input.GetKey(KeyCode.LeftShift) ? fastMoveSpeed : moveSpeed;
            Vector3 newPosition = transform.position + moveDirection * currentSpeed * Time.deltaTime;
            
            // Apply boundaries
            if (useBoundaries)
            {
                newPosition.x = Mathf.Clamp(newPosition.x, boundaryMin.x, boundaryMax.x);
                newPosition.z = Mathf.Clamp(newPosition.z, boundaryMin.y, boundaryMax.y);
                newPosition.y = Mathf.Clamp(newPosition.y, minZoomHeight, maxZoomHeight);
            }
            
            transform.position = newPosition;
        }
        
        // Handle rotation with keyboard
        if (Input.GetKey(KeyCode.LeftArrow) || Input.GetKey(KeyCode.RightArrow))
        {
            float rotationInput = 0f;
            if (Input.GetKey(KeyCode.LeftArrow))
                rotationInput = -1f;
            if (Input.GetKey(KeyCode.RightArrow))
                rotationInput = 1f;
                
            currentRotationY += rotationInput * rotationSpeed * Time.deltaTime;
            ApplyRotation();
        }
        
        // Reset camera position/rotation
        if (Input.GetKeyDown(KeyCode.R))
        {
            ResetCamera();
        }
    }
    
    private void HandleMouseInput()
    {
        // Middle mouse button for rotation
        if (Input.GetMouseButtonDown(2))
        {
            isRotating = true;
            lastMousePosition = Input.mousePosition;
            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
        }
        
        if (Input.GetMouseButtonUp(2))
        {
            isRotating = false;
            Cursor.lockState = CursorLockMode.None;
            Cursor.visible = true;
        }
        
        // Right mouse button for panning
        if (Input.GetMouseButtonDown(1))
        {
            isPanning = true;
            lastMousePosition = Input.mousePosition;
        }
        
        if (Input.GetMouseButtonUp(1))
        {
            isPanning = false;
        }
        
        // Handle mouse look rotation
        if (isRotating)
        {
            float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity;
            float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity;
            
            currentRotationY += mouseX;
            currentRotationX -= mouseY;
            
            // Clamp vertical rotation
            currentRotationX = Mathf.Clamp(currentRotationX, minVerticalAngle, maxVerticalAngle);
            
            ApplyRotation();
        }
        
        // Handle panning
        if (isPanning)
        {
            Vector3 mouseDelta = Input.mousePosition - lastMousePosition;
            
            // Convert screen movement to world movement
            Vector3 worldDelta = cam.ScreenToWorldPoint(new Vector3(mouseDelta.x, mouseDelta.y, cam.nearClipPlane));
            Vector3 panMovement = -worldDelta * 0.1f; // Adjust sensitivity
            
            // Apply movement relative to camera orientation
            Vector3 newPosition = transform.position + transform.TransformDirection(panMovement);
            
            // Apply boundaries
            if (useBoundaries)
            {
                newPosition.x = Mathf.Clamp(newPosition.x, boundaryMin.x, boundaryMax.x);
                newPosition.z = Mathf.Clamp(newPosition.z, boundaryMin.y, boundaryMax.y);
            }
            
            transform.position = newPosition;
            lastMousePosition = Input.mousePosition;
        }
    }
    
    private void HandleScrollWheel()
    {
        float scroll = Input.GetAxis("Mouse ScrollWheel");
        
        if (Mathf.Abs(scroll) > 0.01f)
        {
            // Zoom by moving camera forward/backward
            Vector3 zoomDirection = transform.forward * scroll * zoomSpeed;
            Vector3 newPosition = transform.position + zoomDirection;
            
            // Clamp zoom height
            newPosition.y = Mathf.Clamp(newPosition.y, minZoomHeight, maxZoomHeight);
            
            // Apply boundaries
            if (useBoundaries)
            {
                newPosition.x = Mathf.Clamp(newPosition.x, boundaryMin.x, boundaryMax.x);
                newPosition.z = Mathf.Clamp(newPosition.z, boundaryMin.y, boundaryMax.y);
            }
            
            transform.position = newPosition;
        }
    }
    
    private void ApplyRotation()
    {
        transform.rotation = Quaternion.Euler(currentRotationX, currentRotationY, 0f);
    }
    
    public void ResetCamera()
    {
        // Reset to a default position and rotation
        transform.position = new Vector3(0f, 50f, -50f);
        transform.rotation = Quaternion.Euler(30f, 0f, 0f);
        
        currentRotationX = 30f;
        currentRotationY = 0f;
        
        Debug.Log("Camera reset to default position");
    }
    
    public void FocusOnPosition(Vector3 targetPosition, float height = 50f)
    {
        Vector3 newPosition = targetPosition + new Vector3(0f, height, -height * 0.5f);
        transform.position = newPosition;
        transform.LookAt(targetPosition);
        
        // Update rotation values
        Vector3 eulerAngles = transform.eulerAngles;
        currentRotationY = eulerAngles.y;
        currentRotationX = eulerAngles.x;
        if (currentRotationX > 180f)
            currentRotationX -= 360f;
    }
    
    public void SetBoundaries(Vector2 min, Vector2 max)
    {
        boundaryMin = min;
        boundaryMax = max;
        useBoundaries = true;
    }
    
    public void SetCameraSpeed(float newMoveSpeed, float newFastSpeed)
    {
        moveSpeed = newMoveSpeed;
        fastMoveSpeed = newFastSpeed;
    }
    
    private void OnDrawGizmosSelected()
    {
        if (useBoundaries)
        {
            // Draw boundary box
            Gizmos.color = Color.yellow;
            Vector3 center = new Vector3((boundaryMin.x + boundaryMax.x) / 2f, transform.position.y, (boundaryMin.y + boundaryMax.y) / 2f);
            Vector3 size = new Vector3(boundaryMax.x - boundaryMin.x, 0.1f, boundaryMax.y - boundaryMin.y);
            Gizmos.DrawWireCube(center, size);
        }
    }
}
