//
//  myTotal.playground
//  AustinDrinks
//
//  Created by Austin Faulkner on 3/12/22.
//

import Foundation
import UIKit
import MapKit
import AVFoundation
import CoreData

class PhotoCell: UICollectionViewCell {
    @IBOutlet var imageReview: UIImageView!
}

extension PhotoCell {
    func set(image: UIImage) {
        imageReview.image = image
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        imageReview.layer.cornerRadius = 9
        imageReview.layer.masksToBounds = true
    }
}

class PhotosViewController: UIViewController {

    @IBOutlet var collectionView: UICollectionView!
    var selectedEstablishmentID: Int?
    var establishmentPhotos: [EstablishmentPhotoItem] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        initialize()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        checkPhotos()
    }
}

private extension PhotosViewController {
    func initialize() {
        setupCollectionView()
    }
    
    func setupCollectionView() {
        let flow = UICollectionViewFlowLayout()
        flow.sectionInset = UIEdgeInsets(top: 7, left: 7, bottom: 7, right: 7)
        flow.minimumInteritemSpacing = 0
        flow.minimumLineSpacing = 7
        flow.scrollDirection = .horizontal
        collectionView.collectionViewLayout = flow
    }
    
    // Validation on the existence of photos fetched.
    func checkPhotos() {
        let viewController = self.parent as? EstablishmentDetailViewController
        if let id = viewController?.selectedEstablishment?.establishmentID {
            establishmentPhotos = CoreDataManager.shared.fetchRestPhotos(by: id)
            if establishmentPhotos.count > 0 {
                collectionView.backgroundView = nil
            } else {
                let view = NoDataView(frame: CGRect(x: 0, y: 0, width: collectionView.frame.width, height: collectionView.frame.height))
                view.set(title: "Photos", desc: "There are currently no photos", accomm: "", rating: "", count: "")
                collectionView.backgroundView = view
            }
            collectionView.reloadData()
        }
    }
}

extension PhotosViewController: UICollectionViewDataSource {
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        establishmentPhotos.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "photoCell", for: indexPath) as! PhotoCell
        let item = establishmentPhotos[indexPath.item]
        if let photo = item.photo { cell.set(image: photo )}
        return cell
    }
}

// Photo View Data Flow Design -> How the image renders in the reviews cell.
extension PhotosViewController: UICollectionViewDelegateFlowLayout {
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath:IndexPath) -> CGSize {
        if establishmentPhotos.count == 1 {
            let width = collectionView.frame.size.width - 14
            return CGSize(width: width, height: 200)
        } else {
            let width = collectionView.frame.size.width - 21
            return CGSize(width: width, height: 200)
        }
    }
}

class ReviewCell: UICollectionViewCell {

    @IBOutlet var titleLabel: UILabel!
    @IBOutlet var dateLabel: UILabel!
    @IBOutlet var nameLabel: UILabel!
    @IBOutlet var reviewLabel: UILabel!
    @IBOutlet var ratingsView: RatingsView!
}

class ReviewsViewController: UIViewController {

    @IBOutlet var collectionView: UICollectionView!
    var selectedEstablishmentID: Int?
    private var reviewItems: [ReviewItem] = []
    private var dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM dd, yyyy"
        return formatter
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        initialize()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        checkReviews()
    }
}

private extension ReviewsViewController {
    
    func initialize() {
        setupCollectionView()
    }
    
    // Flow design
    func setupCollectionView() {
        let flow = UICollectionViewFlowLayout()
        flow.sectionInset = UIEdgeInsets(top: 7, left: 7, bottom: 7, right: 7)
        flow.minimumInteritemSpacing = 0
        flow.minimumLineSpacing = 7
        flow.scrollDirection = .horizontal
        collectionView.collectionViewLayout = flow
    }
    
    // Validation on the existence of photos fetched.
    func checkReviews() {
        let viewController = self.parent as? EstablishmentDetailViewController
        if let establishmentID = viewController?.selectedEstablishment?.establishmentID {
            reviewItems = CoreDataManager.shared.fetchReviews(by: establishmentID)
            if !reviewItems.isEmpty {
                collectionView.backgroundView = nil
            } else {
                let view = NoDataView(frame: CGRect(x: 0, y: 0, width: collectionView.frame.width, height: collectionView.frame.height))
                view.set(title: "Reviews", desc: "There are currently no reviews.", accomm: "", rating: "", count: "") // TODO: Maybe I can change this method set(). See NoDataView.swift
                collectionView.backgroundView = view
            }
        }
        collectionView.reloadData()
    }
}

extension ReviewsViewController: UICollectionViewDataSource {
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        reviewItems.count
    }
    
    // The collection view for reviews cell
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "reviewCell", for: indexPath) as! ReviewCell
        let reviewItem = reviewItems[indexPath.item]
        cell.nameLabel.text = reviewItem.name
        cell.titleLabel.text = reviewItem.title
        cell.reviewLabel.text = reviewItem.customerReview
        if let reviewItemDate = reviewItem.date {
            cell.dateLabel.text = dateFormatter.string(from: reviewItemDate)
        }
        if let reviewItemRating = reviewItem.rating {
            cell.ratingsView.rating = reviewItemRating
        }
        return cell
    }
}

// Reviews View Data Flow Design -> How the user reviews render in the reviews cell.
extension ReviewsViewController: UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        let edgeInset = 7.0
        if reviewItems.count == 1 {
            let cellWidth = collectionView.frame.size.width - (edgeInset * 2)
            return CGSize(width: cellWidth, height: 200)
        } else {
            let cellWidth = collectionView.frame.size.width - (edgeInset * 3)
            return CGSize(width: cellWidth, height: 200)
        }
        
    }
}

struct FilterItem {
    let filter: String?
    let name: String?
    init(dict: [String: String]) {
        self.filter = dict["filter"]
        self.name = dict["name"]
    }
}

class FilterDataManager: DataManager {
    func fetch() -> [FilterItem] {
        var filterItems: [FilterItem] = []
        for data in loadPlist(file: "FilterData") {
            filterItems.append(FilterItem(dict: data as! [String: String]))
        }
        return filterItems
    }
}

struct EstablishmentPhotoItem {
    var date: Date?
    var photo: UIImage?
    var photoData: Data {
        guard let photo = photo,
              let photoData = photo.pngData() else {
                  return Data()
              }
        return photoData
    }
    var establishmentID: Int64?
    // Unique id for the establishment corresponding to users' photos
    var uuid = UUID()
}

extension EstablishmentPhotoItem {
    // Constructor
    init(establishmentPhoto: EstablishmentPhoto) {
        self.date = establishmentPhoto.date
        if let estPhoto = establishmentPhoto.photo {
            self.photo = UIImage(data: estPhoto, scale: 1.0)
        }
        self.establishmentID = establishmentPhoto.establishmentID
        if let estPhotoUUID = establishmentPhoto.uuid {
            self.uuid = estPhotoUUID
        }
    }
}

protocol ImageFiltering {
    func apply(filter: String, originalImage: UIImage) -> UIImage
}

extension ImageFiltering {
    func apply(filter: String, originalImage: UIImage) -> UIImage {
        let initialCIImage = CIImage(image: originalImage, options: nil)
        let originalOrientation = originalImage.imageOrientation
        guard let ciFilter = CIFilter(name: filter) else {
            print("Filter not found")
            return originalImage
        }
        ciFilter.setValue(initialCIImage, forKey: kCIInputImageKey)
        let context = CIContext()
        let filteredCIImage = (ciFilter.outputImage)!
        let filteredCGImage = context.createCGImage(filteredCIImage, from: filteredCIImage.extent)
        return UIImage(cgImage: filteredCGImage!, scale: 1.0, orientation: originalOrientation)
    }
}

class FilterCell: UICollectionViewCell {
    
    @IBOutlet var nameLabel: UILabel!
    @IBOutlet var thumbnailImageView: UIImageView!
    override func awakeFromNib() {
        super.awakeFromNib()
        thumbnailImageView.layer.cornerRadius = 9
        thumbnailImageView.layer.masksToBounds = true
    }
}

extension FilterCell: ImageFiltering {
    func set(filterItem: FilterItem, imageForThumbnail: UIImage) {
        nameLabel.text = filterItem.name
        if let filter = filterItem.filter {
            if filter != "None" {
                let filteredImage = apply(filter: filter, originalImage: imageForThumbnail)
                thumbnailImageView.image = filteredImage
            } else {
                thumbnailImageView.image = imageForThumbnail
            }
        }
    }
}

class PhotoFilterViewController: UIViewController {

    @IBOutlet var mainImageView: UIImageView!
    @IBOutlet var collectionView: UICollectionView!
    private let manager = FilterDataManager()
    var selectedEstablishmentID: Int?
    private var mainImage: UIImage?
    private var thumbnail: UIImage?
    private var filters: [FilterItem] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        initialize()
    }
}

// MARK: - private extension
private extension PhotoFilterViewController {
    
    func initialize() {
        setupCollectionView()
        checkSource()
    }
    
    func saveSelectedPhoto() {
        if let mainImage = self.mainImageView.image {
            var estPhotoItem = EstablishmentPhotoItem()
            estPhotoItem.date = Date()
            if #available(iOS 15.0, *) { // If using iOS 15.0 or later, otherwise fallback
                estPhotoItem.photo = mainImage.preparingThumbnail(of: CGSize(width: 100, height: 100))
            } else {
                // Fallback on earlier versions
            }
            if let selEstID = selectedEstablishmentID {
                estPhotoItem.establishmentID = Int64(selEstID)
            }
            CoreDataManager.shared.addPhoto(estPhotoItem)
        }
        dismiss(animated: true, completion: nil)
    }
    
    func setupCollectionView() {
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .horizontal
        layout.sectionInset = UIEdgeInsets(top: 7, left: 7, bottom: 7, right: 7)
        layout.minimumInteritemSpacing = 0
        layout.minimumLineSpacing = 7
        collectionView.collectionViewLayout = layout
        collectionView.dataSource = self
        collectionView.delegate = self
    }

    func checkSource() {
        let cameraMediaType = AVMediaType.video
        let cameraAuthorizationStatus = AVCaptureDevice.authorizationStatus(for: cameraMediaType)
        switch cameraAuthorizationStatus {
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: cameraMediaType) { granted in
                if granted {
                    DispatchQueue.main.async {
                        self.showCameraUserInterface()
                    }
                }
            }
        case .authorized:
            self.showCameraUserInterface()
        default:
            break
        }
    }
    
    func showApplyFilterInterface() {
        filters = manager.fetch()
        if let mainImage = self.mainImage {
            mainImageView.image = mainImage
            collectionView.reloadData()
        }
    }
    
    @IBAction func onPhotoTapped(_ sender: Any) {
        checkSource()
    }
    
    @IBAction func onSaveTapped(_ sender: Any) {
        saveSelectedPhoto()
    }
}

extension PhotoFilterViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        filters.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "filterCell", for: indexPath) as! FilterCell
        let filterItem = filters[indexPath.row]
        if let thumbnail = thumbnail {
            cell.set(filterItem: filterItem, imageForThumbnail: thumbnail)
        }
        return cell
    }
}

extension PhotoFilterViewController: UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        let collectionViewHeight = collectionView.frame.size.height
        let topInset = 14.0
        let cellHeight = collectionViewHeight - topInset
        return CGSize(width: 150, height: cellHeight)
    }
}

extension PhotoFilterViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    func showCameraUserInterface() {
        let imagePicker = UIImagePickerController()
        imagePicker.delegate = self
        #if targetEnvironment(simulator)
        imagePicker.sourceType = UIImagePickerController.SourceType.photoLibrary
        #else
        imagePicker.sourceType = UIImagePickerController.SourceType.camera
        imagePicker.showsCameraControls = true
        #endif
        imagePicker.mediaTypes = ["public.image"]
        imagePicker.allowsEditing = true
        self.present(imagePicker, animated: true, completion: nil)
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        if let selectedImage = info[UIImagePickerController.InfoKey.editedImage] as? UIImage {
            if #available(iOS 15.0, *) {
                self.thumbnail = selectedImage.preparingThumbnail(of: CGSize(width: 100, height: 100))
            } else {
                // Fallback on earlier versions
            }
            let mainImageViewSize = mainImageView.frame.size
            if #available(iOS 15.0, *) {
                self.mainImage = selectedImage.preparingThumbnail(of: mainImageViewSize)
            } else {
                // Fallback on earlier versions
            }
        }
        picker.dismiss(animated: true) {
            self.showApplyFilterInterface()
        }
    }
}

extension PhotoFilterViewController: ImageFiltering {
    func filterMainImage(filterItem: FilterItem) {
        if let mainImage = mainImage,
           let filter = filterItem.filter {
            if filter != "None" {
                mainImageView.image = self.apply(filter: filter, originalImage: mainImage)
            } else {
                mainImageView.image = mainImage
            }
        }
    }
}

extension PhotoFilterViewController: UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let filterItem = self.filters[indexPath.row]
        filterMainImage(filterItem: filterItem)
    }
}

struct ReviewItem {
    var date: Date?
    var rating: Double?
    var title: String?
    var name: String?
    var customerReview: String?
    var establishmentID: Int64?
    var uuid = UUID()
}

extension ReviewItem {
    init(review: Review) {
        self.date = review.date
        self.rating = review.rating
        self.title = review.title
        self.name = review.name
        self.customerReview = review.customerReview
        self.establishmentID = review.establishmentID
        if let reviewUUID = review.uuid {
            self.uuid = reviewUUID
        }
    }
}

class RatingsView: UIControl {

    private let filledStarImage = UIImage(named: "filled-star")
    private let halfStarImage = UIImage(named: "half-star")
    private let emptyStarImage = UIImage(named: "empty-star")
    private var totalStars = 5
    
    // Setter
    var rating = 0.0 {
        didSet {
            setNeedsDisplay()
        }
    }
    
    // %-filled for UI star rendering
    override func draw(_ rect: CGRect) {
        let context = UIGraphicsGetCurrentContext()
        context!.setFillColor(UIColor.systemBackground.cgColor)
        context!.fill(rect)
        let ratingsViewWidth = rect.size.width
        let availableWidthForStar = ratingsViewWidth / Double(totalStars)
        let starSidelength = (availableWidthForStar <= rect.size.height) ? availableWidthForStar : rect.size.height
        for index in 0..<totalStars {
            let starOriginX = (availableWidthForStar * Double(index)) + ((availableWidthForStar - starSidelength) / 2)
            let starOriginY = ((rect.size.height - starSidelength) / 2)
            let frame = CGRect(x: starOriginX, y: starOriginY, width: starSidelength, height: starSidelength)
            var starToDraw: UIImage!
            if (Double(index + 1) <= self.rating) {
                starToDraw = filledStarImage
            } else if (Double(index + 1) <= self.rating.rounded()) {
                starToDraw = halfStarImage
            } else {
                starToDraw = emptyStarImage
            }
            starToDraw.draw(in: frame)
        }
    }
    
    override var canBecomeFirstResponder: Bool {
        true
    }
    
    // Touch event boolean
    override func beginTracking(_ touch: UITouch, with event: UIEvent?) -> Bool {
        guard self.isEnabled else {
            return false
        }
        super.beginTracking(touch, with: event)
        handle(with: touch)
        return true
    }

}

// Calculated rating based upon star rating touch event -> namely, overall rating calculation
// for the average number of stars in the rating determined by users.
private extension RatingsView {
    func handle(with touch: UITouch) {
        let starRectWidth = self.bounds.size.width / Double(totalStars)
        let location = touch.location(in: self)
        var value = location.x / starRectWidth
        if (value + 0.5) < value.rounded(.up) {
            value = floor(value) + 0.5
        } else {
            value = value.rounded(.up)
        }
        updateRating(with: value)
    }
    
    func updateRating(with newValue: Double) {
        if (self.rating != newValue && newValue >= 0 && newValue <= Double(totalStars)) {
            self.rating = newValue
        }
    }
}

class ReviewFormViewController: UITableViewController {
    
    var selectedEstablishmentID: Int?
    
    @IBOutlet var ratingsView: RatingsView!
    @IBOutlet var titleTextField: UITextField!
    @IBOutlet var nameTextField: UITextField!
    @IBOutlet var reviewTextView: UITextView!
//    @IBOutlet var yelpReviewsTextView: UITextView!  // see if we can add a UIView to contain all Yelp reviews. TODO: evaluate whether or not to use this. Probably not.
    

    override func viewDidLoad() {
        super.viewDidLoad()
        print(selectedEstablishmentID as Any)
    }
}

// Indicates what is saved in the user review upon clicking "Save".
// Reviews save to CoreData on the Device, iPhone or iPad
private extension ReviewFormViewController {
    @IBAction func onSaveTapped(_ sender: Any) {
        var reviewItem = ReviewItem()
        reviewItem.rating = ratingsView.rating
        reviewItem.title = titleTextField.text
        reviewItem.name = nameTextField.text
        reviewItem.customerReview = reviewTextView.text
        if let selEstID = selectedEstablishmentID {
            reviewItem.establishmentID = Int64(selEstID)
        }
        CoreDataManager.shared.addReview(reviewItem)
        dismiss(animated: true, completion: nil)
    }
}

class EstablishmentDetailViewController: UITableViewController {
    
    // Nav Bar
    @IBOutlet var heartButton: UIBarButtonItem! // TO IMPLEMENT OR NOT?!? TODO: Consider it later; probably not going to implement.
    @IBOutlet var nameLabel: UILabel!
    @IBOutlet var tagsLabel: UILabel!
    @IBOutlet var headerAddressLabel: UILabel!
    @IBOutlet var overallRatingLabel: UILabel!
    @IBOutlet var ratingsView: RatingsView!
    @IBOutlet var priceLabel: UILabel!
    @IBOutlet var addressLabel: UILabel!
    @IBOutlet var telephoneLabel: UILabel!
    @IBOutlet var locationMapImageView: UIImageView!
    @IBOutlet var hoursOfOperationLabel: UILabel!
    @IBOutlet var unaccommodationsLabelDetail: UILabel!
    
    var st: String!
    var cityStateZip: String!
    
    var selectedEstablishment: EstablishmentItem?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        initialize()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        createRating()
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let identifier = segue.identifier {
            switch identifier {
            case Segue.showReview.rawValue:
                showReview(segue: segue)
            case Segue.showPhotoFilter.rawValue:
                showPhotoFilter(segue: segue)
            default:
                print("Segue not added.")
            }
        }
    }
}

private extension EstablishmentDetailViewController {
    
    func initialize() {
        setupLabels()
        createMap()
        createRating()
    }
    
    @IBAction func unwindReviewCancel(segue: UIStoryboardSegue) {
    }
    
    func showReview(segue: UIStoryboardSegue) {
        guard let navController = segue.destination as? UINavigationController,
              let viewController = navController.topViewController as? ReviewFormViewController else {
                  return
              }
        viewController.selectedEstablishmentID = selectedEstablishment?.establishmentID
    }
    
    func showPhotoFilter(segue: UIStoryboardSegue) {
        guard let navController = segue.destination as? UINavigationController,
              let viewController = navController.topViewController as? PhotoFilterViewController else {
                  return
              }
        viewController.selectedEstablishmentID = selectedEstablishment?.establishmentID
    }
    
    func createRating() {
        ratingsView.isEnabled = false
        if let establishmentID = selectedEstablishment?.establishmentID {
            let ratingValue = CoreDataManager.shared.fetchEstablishmentRating(by: establishmentID)
            ratingsView.rating = ratingValue
            if ratingValue.isNaN {
                overallRatingLabel.text = "0.0"
            } else {
                let roundedValue = ((ratingValue * 10).rounded() / 10)
                overallRatingLabel.text = "\(roundedValue)"
            }
        }
    }
    
    func setupLabels() {
        guard let establishment = selectedEstablishment else {
            return
        }
        st = establishment.address
        cityStateZip = establishment.city + ", " + establishment.state + " " + establishment.postal_code
        
        title = establishment.name
        nameLabel.text = establishment.name
        
        tagsLabel.text = establishment.subtitle  // namely, tags in EstablishmentItems
        
        headerAddressLabel.text = st + "\n" + cityStateZip
        telephoneLabel.text = establishment.telephone
        addressLabel.text = establishment.address
        priceLabel.text = establishment.price
       
        hoursOfOperationLabel.text = establishment.hoursOfOperation()
        unaccommodationsLabelDetail.text = establishment.unaccommodation_attributes
    }
    
    func createMap() {
        guard let annotation = selectedEstablishment,
              let long = annotation.longitude,
              let lat = annotation.latitude else {
                  return
              }
              let location = CLLocationCoordinate2D(latitude: lat, longitude: long)
        takeSnapshot(with: location)
    }
    
    func takeSnapshot(with location: CLLocationCoordinate2D) {
        let mapSnapshotOptions = MKMapSnapshotter.Options()
        var loc = location
        let polyline = MKPolyline(coordinates: &loc, count: 1)
        let region = MKCoordinateRegion(polyline.boundingMapRect)
        mapSnapshotOptions.region = region
        mapSnapshotOptions.scale = UIScreen.main.scale
        mapSnapshotOptions.size = CGSize(width: 340, height: 208)
        mapSnapshotOptions.showsBuildings = true
        mapSnapshotOptions.pointOfInterestFilter = .includingAll
        let snapShotter = MKMapSnapshotter(options: mapSnapshotOptions)
        snapShotter.start() { snapshot, error in
            guard let snapshot = snapshot else {
                return
            }
            UIGraphicsBeginImageContextWithOptions(mapSnapshotOptions.size, true, 0)
            snapshot.image.draw(at: .zero)
            let identifier = "custompin"
            let annotation = MKPointAnnotation()
            annotation.coordinate = location
            let pinView = MKPinAnnotationView(annotation: annotation, reuseIdentifier: identifier)
            pinView.image = UIImage(named: "custom-annotation")!
            let pinImage = pinView.image
            var point = snapshot.point(for: location)
            let rect = self.locationMapImageView.bounds
            if rect.contains(point) {
                let pinCenterOffset = pinView.centerOffset
                point.x -= pinView.bounds.size.width / 2
                point.y -= pinView.bounds.size.height / 2
                point.x += pinCenterOffset.x
                point.y += pinCenterOffset.y
                pinImage?.draw(at: point)
            }
            if let image = UIGraphicsGetImageFromCurrentImageContext() {
                UIGraphicsEndImageContext()
                DispatchQueue.main.async {
                    self.locationMapImageView.image = image
                }
            }
        }
    }
}

extension EstablishmentDetailViewController: UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        let viewWidth = collectionView.frame.size.width
        let columns: CGFloat = 0
        let inset = 9.0
        let contentWidth = viewWidth - inset * (columns + 1)
        let cellWidth = contentWidth
        let cellHeigth = 312.0
        return CGSize(width: cellWidth, height: cellHeigth)
    }
}

struct CoreDataManager {
    let container: NSPersistentContainer
    init() {
        container = NSPersistentContainer(name: "AustinDrinksModel")
        container.loadPersistentStores {
            (storeDesc, error) in
            error.map {
                print($0)
            }
        }
    }
    
    func addReview(_ reviewItem: ReviewItem) {
        let review = Review(context: container.viewContext)
        review.date = Date()
        if let reviewItemRating = reviewItem.rating {
            review.rating = reviewItemRating
        }
        review.title = reviewItem.title
        review.name = reviewItem.name
        review.customerReview = reviewItem.customerReview
        if let reviewItemEstID = reviewItem.establishmentID {
            review.establishmentID = reviewItemEstID
        }
        review.uuid = reviewItem.uuid
        save()
    }
    
    func fetchEstablishmentRating(by identifier: Int) -> Double {
        let reviewItems = fetchReviews(by: identifier)
        let sum = reviewItems.reduce(0, {$0 + ($1.rating ?? 0)})
        return sum / Double(reviewItems.count)
    }
    
    func addPhoto(_ estPhotoItem: EstablishmentPhotoItem) {
        let estPhoto = EstablishmentPhoto(context: container.viewContext)
        estPhoto.date = Date()
        estPhoto.photo = estPhotoItem.photoData
        if let estPhotoID = estPhotoItem.establishmentID {
            estPhoto.establishmentID = estPhotoID
        }
        estPhoto.uuid = estPhotoItem.uuid
        save()
    }
    
    func fetchReviews(by identifier: Int) -> [ReviewItem] {
        let moc = container.viewContext
        let request = Review.fetchRequest()
        let predicate = NSPredicate(format: "establishmentID = %i", identifier)
        var reviewItems: [ReviewItem] = []
        request.sortDescriptors = [NSSortDescriptor(key: "date", ascending: false)]
        request.predicate = predicate
        do {
            for review in try moc.fetch(request) {
                reviewItems.append(ReviewItem(review: review))
            }
            return reviewItems
        } catch {
            fatalError("Failed to fetch reviews: \(error)")
        }
    }
    
    func fetchRestPhotos(by identifier: Int) -> [EstablishmentPhotoItem] {
        let moc = container.viewContext
        let request = EstablishmentPhoto.fetchRequest()
        let predicate = NSPredicate(format: "establishmentID = %i", identifier)
        var estPhotoItems: [EstablishmentPhotoItem] = []
        request.sortDescriptors = [NSSortDescriptor(key: "date", ascending: false)]
        request.predicate = predicate
        do {
            for estPhoto in try moc.fetch(request) {
                estPhotoItems.append(EstablishmentPhotoItem(establishmentPhoto: estPhoto))
            }
            return estPhotoItems
        } catch {
            fatalError("Failed to fetch establishment photos: \(error)")
        }
    }
    
    
    private func save() {
        do {
            if container.viewContext.hasChanges {
                try container.viewContext.save()
            }
        } catch let error {
            print(error.localizedDescription)
        }
    }
}

extension CoreDataManager {
    static var shared = CoreDataManager()
}

// Down up to CoreDataManager.swift
// TODO: Put the remainder here.

class NoDataView: UIView {

    
    var view: UIView!
    
    @IBOutlet var titleLabel: UILabel!
    @IBOutlet var descLabel: UILabel!
    @IBOutlet var accommLabel: UILabel!
    @IBOutlet var ratingLabel:UILabel!
    @IBOutlet var countLabel: UILabel!
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupView()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupView()
    }
    
    func loadViewFromNib() -> UIView {
        let nib = UINib(nibName: "NoDataView", bundle: Bundle.main)
        let view = nib.instantiate(withOwner: self, options: nil) [0] as! UIView
        return view
    }
    
    func setupView() {
        view = loadViewFromNib()
        view.frame = bounds
        view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        addSubview(view)
    }
                                                          // formerly Double; formerly Int
    func set(title: String, desc: String, accomm: String, rating: String, count: String) {
        titleLabel.text = title
        descLabel.text = desc
        accommLabel.text = accomm
        ratingLabel.text = rating //.description  // Just need an Int versioned UILabel member;
                                   // might have to change this to text along with argument Ints  -> String;
                                   // this would require us to change rating_value -> String & rating_count -> String
        countLabel.text = count //.description
    }
}

protocol DataManager {
    func loadPlist(file name: String) -> [[String: AnyObject]]
}

extension DataManager {
    func loadPlist(file name: String) -> [[String: AnyObject]] {
        guard let path = Bundle.main.path(forResource: name, ofType: "plist"),
              let itemsData = FileManager.default.contents(atPath: path),
              let items = try! PropertyListSerialization.propertyList(from: itemsData, format: nil) as? [[String: AnyObject]] else {
                  return [[:]]
              }
        return items
    }
}

enum Segue: String {
    case showDetail
    case showRating
    case showReview
    case showAllReviews
    case establishmentList
    case locationList
    case showPhotoReview
    case showPhotoFilter
}

enum Device {
    static var isPhone: Bool {
        UIDevice.current.userInterfaceIdiom == .phone
    }
    static var isPad: Bool {
        UIDevice.current.userInterfaceIdiom == .pad
    }
}

class EstablishmentItem: NSObject, MKAnnotation, Decodable {
    
    // All attributes and their types in the JSON data structure.
    let name: String?
    let establishmentID: Int?
    let open_for_business: Int?
    let tags: [String]
    let website: String  // unwrapped to fix Go button in DrinkingEstablishmentListViewController TODO: remove this commment
    let longitude: Double?
    let latitude: Double?
    let address: String
    let postal_code: String
    let city: String
    let state: String
    let telephone: String?
    let price: String?
    var hours: [String: String]
    let accommodations: [String]
    let unaccommodations: [String]
    let rating_value: String?
    let rating_count: String?
    let reviews: [[String: String]] // TODO: remove from JSON and then remove here . . .
    
    enum CodingKeys: String, CodingKey {
        case name = "name"
        case establishmentID = "id"
        case open_for_business = "open_for_business"
        case tags = "tags"
        case website = "website"
        case longitude = "longitude"
        case latitude = "latitude"
        case address = "address"
        case postal_code = "postal_code"
        case city = "city"
        case state = "state"
        case telephone = "telephone"
        case price = "price"
        case hours = "hours"
        case accommodations = "accommodations"
        case unaccommodations = "unaccommodations"
        case rating_value = "rating_value"
        case rating_count = "review_count"
        case reviews = "reviews"
    }
    
    // Coordinate setter
    var coordinate: CLLocationCoordinate2D {
        guard let latitude = latitude, let longitude = longitude else {
            return CLLocationCoordinate2D()
        }
        return CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }
    
    // Setter
    var title: String? {
        name
    }
    
    // Setter
    var estID: Int? {
        establishmentID
    }
    
    // Iterates through a list of tags, where tags in the code are understood to be
    // drinking establishment types--namely, brewery, distillery, or winery.
    var subtitle: String? {
        if tags.isEmpty {
            return ""
        } else if tags.count == 1 {
            return tags.first
        } else {
            return tags.joined(separator: ", ")
        }
    }
      
    // Iterates through a list of establishment accommodations
    var accommodation_attributes: String? {
        if accommodations.isEmpty {
            return ""
        } else if accommodations.count == 1 {
            return accommodations.first
        } else {
            return accommodations.joined(separator: "\n")
        }
    }
    
    // Decodable does not order an already unordered dictionary, so this function orders the hours of operation from
    // the beginning of the week to the end.
    func orderHoursOfOperations() -> [[String: String]] {
        let order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        var list_h: [[String: String]] = [[:]]
        for day in order {
            for (key, value) in hours {
                if (key == day) {
                    var dict: [String:String] = [:]
                    dict[key] = value
                    list_h.append(dict)
                    break
                }
            }
        }
        return list_h
    }
    
    // Returns the ordered hours of operation
    func hoursOfOperation() -> String {
        let h = orderHoursOfOperations()
        var hoursOfOp = ""
        for obj in h {
            for (key, value) in obj{
            hoursOfOp.append("\(key) : \(value)\n")
            }
        }
        return hoursOfOp
    }
    
    // Iterates through a list of what I'm calling "unaccommodations" or
    // other information one might like to know that is not an accommodation.
    // An example is "No pets allowed".
    var unaccommodation_attributes: String? {
        if unaccommodations.isEmpty {
            return ""
        } else if unaccommodations.count == 1 {
            return unaccommodations.first
        } else {
            return unaccommodations.joined(separator: "\n")
        }
    }
    
    // Setter
    var ratingVal: String? {
        rating_value
    }
    
    // Setter
    var ratingCount: String? {
        rating_count
    }
    
    // Setter
    var site: String {
        website
    }
}


class MapDataManager: DataManager {
    private var items: [EstablishmentItem] = []
    var annotations: [EstablishmentItem] {
        items
    }
    
    var selectedCity: LocationItem?
    
    
    func fetch(completion: (_ annotations: [EstablishmentItem]) -> ()) {
        let manager = EstablishmentDataManager()
        
//        let locationManager = LocationDataManager() // TODO: Forget this, it generalizes to the whole U.S.
//
        //--------------------------------------------------
//        guard let city = selectedCity?.city else { return }
        
//        guard let cityChoice = locationManager.selectedCity?.city else { return }

//
        //--------------------------------------------------
        
        
        manager.fetch(location: "Austin", completionHandler: {
//        manager.fetch(location: cityChoice, completionHandler: {
            (establishmentItems) in self.items = establishmentItems
            completion(items)
        })
    }
    
    func initialRegion(latDelta: CLLocationDegrees, longDelta: CLLocationDegrees) -> MKCoordinateRegion {
        guard let item = items.first else {
            return MKCoordinateRegion()
        }

        let span = MKCoordinateSpan(latitudeDelta: latDelta, longitudeDelta: longDelta)
        return MKCoordinateRegion(center: item.coordinate, span: span)
    }
    
    func currentRegion(latDelta: CLLocationDegrees, longDelta: CLLocationDegrees) -> MKCoordinateRegion {
        guard let item = items.first else {
            return MKCoordinateRegion()
        }

        let span = MKCoordinateSpan(latitudeDelta: latDelta, longitudeDelta: longDelta)
        return MKCoordinateRegion(center: item.coordinate, span: span)
    }
}

class MapViewController: UIViewController {

    @IBOutlet var mapView: MKMapView!
    private let manager = MapDataManager()
    var selectedEstablishment: EstablishmentItem?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        initialize()
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        switch segue.identifier! {
        case Segue.showDetail.rawValue: showEstablishmentDetail(segue: segue)
        default: print("Segue not added")
        }
    }
}

// MARK: Private Extension
private extension MapViewController {
    func initialize() {
        mapView.delegate = self
        manager.fetch { (annotations) in setupMap(annotations) }
    }
    
    func setupMap(_ annotations: [EstablishmentItem]) {
        mapView.setRegion(manager.currentRegion(latDelta: 0.5, longDelta: 0.5), animated: true)
        mapView.addAnnotations(manager.annotations)
    }
    
    func showEstablishmentDetail(segue: UIStoryboardSegue) {
        if let viewController = segue.destination as? EstablishmentDetailViewController,
           let establishment = selectedEstablishment {
            viewController.selectedEstablishment = establishment
        }
    }
}

// MARK: MKMapViewDelegate
extension MapViewController: MKMapViewDelegate {
    
    func mapView(_ mapView: MKMapView, annotationView view: MKAnnotationView, calloutAccessoryControlTapped control: UIControl) {
        guard let annotation = mapView.selectedAnnotations.first else {
            return
        }
        selectedEstablishment = annotation as? EstablishmentItem
        self.performSegue(withIdentifier: Segue.showDetail.rawValue, sender: self)
    }
    
    func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
        let identifier = "custompin"
        guard !annotation.isKind(of: MKUserLocation.self) else {
            return nil
        }
        
        let annotationView: MKAnnotationView
        if let customAnnotationView = mapView.dequeueReusableAnnotationView(withIdentifier: identifier) {
            annotationView = customAnnotationView
            annotationView.annotation = annotation
        } else {
            let av = MKAnnotationView(annotation: annotation, reuseIdentifier: identifier)
            av.rightCalloutAccessoryView = UIButton(type: .detailDisclosure)
            annotationView = av
        }
        annotationView.canShowCallout = true
        if let image = UIImage(named: "custom-annotation") {
            annotationView.image = image
            annotationView.centerOffset = CGPoint(x: -image.size.width / 2, y: -image.size.height / 2)
        }
        return annotationView
    }
}

struct LocationItem: Equatable {
    let city: String?
    let state: String?
}

extension LocationItem {
    init(dict: [String: String]) {
        self.city = dict["city"]
        self.state = dict["state"]
    }
    
    var cityAndState: String {
        guard let city = self.city,
              let state = self.state
        else {
            return ""
        }
        return "\(city), \(state)"
    }
}

class LocationDataManager {
    private var locations: [LocationItem] = []
    
    private func loadData() -> [[String: String]] {
        let decoder = PropertyListDecoder()
        if let path = Bundle.main.path(forResource: "Locations", ofType: "plist"),
           let locationsData = FileManager.default.contents(atPath: path),
           let locations = try? decoder.decode([[String: String]].self, from: locationsData) {
            return locations
        }
        return [[:]]
    }
    
    func fetch() {
        for location in loadData() {
            locations.append(LocationItem(dict: location))
        }
    }
    
    func numberOfLocationsItems() -> Int {
        locations.count
    }
    
    func locationItem(at index: Int) -> LocationItem {
        locations[index]
    }
}

class LocationViewController: UIViewController {

    let manager = LocationDataManager()
    var selectedCity: LocationItem?
    
    @IBOutlet weak var tableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        initialize()
    }
    
    private func setCheckmark(for cell: UITableViewCell, location: LocationItem) {
        if selectedCity == location {
            cell.accessoryType = .checkmark
        } else {
            cell.accessoryType = .none
        }
    }
}

// MARK: Private Extension
private extension LocationViewController {
    func initialize() {
        manager.fetch()
        title = "Choose a destination"
        navigationController?.navigationBar.prefersLargeTitles = true
    }
}

// MARK: UITableViewDataSource
extension LocationViewController: UITableViewDataSource {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        manager.numberOfLocationsItems()
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "locationCell", for: indexPath)
        let location = manager.locationItem(at: indexPath.row)
        cell.textLabel?.text = location.cityAndState
        setCheckmark(for: cell, location: location)
        return cell
    }
}

// MARK: UITableViewDelegate
extension LocationViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if let cell = tableView.cellForRow(at: indexPath) {
            cell.accessoryType = .checkmark
            selectedCity = manager.locationItem(at: indexPath.row)
            tableView.reloadData()
        }
    }
}

// Sets UI fields for the folling attributes
class DrinkingEstablishmentCell: UICollectionViewCell {
            
    @IBOutlet var titleLabel: UILabel!
    @IBOutlet var tagLabel: UILabel!
    @IBOutlet var accommodationsLabel: UILabel!
    @IBOutlet var ratingLabel: UILabel!
    @IBOutlet var countLabel: UILabel!
    
    // Rounds the edges of the DrinkingEstablishmentCell Cells in DrinkingEstablishmentListViewController
    override func layoutSubviews() {
        self.layer.cornerRadius = 9.0
        self.layer.masksToBounds = true
    }
}

class EstablishmentDataManager {
    
    private var establishmentItems: [EstablishmentItem] = []
    
    
    func fetch(location: String, selectedEthanol: String = "All", completionHandler: (_ establishmentItems: [EstablishmentItem]) -> Void) {
        if let file = Bundle.main.url(forResource: location, withExtension: "json") {
            do {
                let data = try Data(contentsOf: file)
                let establishments = try JSONDecoder().decode([EstablishmentItem].self, from: data)
                if selectedEthanol != "All" {
                    establishmentItems = establishments.filter {
                        ($0.tags.contains(selectedEthanol))
                    }
                } else  {
                    establishmentItems = establishments
                }
            } catch {
                print("There was an error \(error)")
            }
        }
        completionHandler(establishmentItems)
    }
    
    func numberOfEstablishmentItems() -> Int {
        establishmentItems.count
    }
    
    func establishmentItem(at index: Int) -> EstablishmentItem {
        establishmentItems[index]
    }
}

class DrinkingEstablishmentsListViewController: UIViewController, UICollectionViewDelegate {
    
    private let manager = EstablishmentDataManager()
    
    var selectedEstablishment: EstablishmentItem?
    var selectedCity: LocationItem?
    var selectedTags: String?
    
    @IBOutlet var collectionView: UICollectionView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let identifier = segue.identifier {
            switch identifier {
            case Segue.showDetail.rawValue:
                showEstablishmentDetail(segue: segue)
            default:
                print("Segue not added.")
            }
        }
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        initialize()
    }

// TODO: implement a more general selectedEstablishment?.website Go button

    @IBAction func goButton(_ sender: UIButton) {
//        if let indexPath = collectionView.indexPathsForSelectedItems?.first {
//            selectedEstablishment = manager.establishmentItem(at: indexPath.row)
//            UIApplication.shared.open(URL(string: selectedEstablishment?.website)! as URL, options: [:], completionHandler: nil)
//        }
//        UIApplication.shared.open(URL(string: selectedEstablishment?.website)! as URL, options: [:], completionHandler: nil)

        UIApplication.shared.open(URL(string: "https://www.hackerrank.com/")! as URL, options: [:], completionHandler: nil)
    }
}

// MARK: Private Extension
private extension DrinkingEstablishmentsListViewController {
    func initialize() {
        createData()
        setupTitle()
        setupCollectionView()
    }
    
    func setupCollectionView() {
        let flow = UICollectionViewFlowLayout()
        flow.sectionInset = UIEdgeInsets(top: 7, left: 7, bottom: 7, right: 7)
        flow.minimumInteritemSpacing = 0
        flow.minimumLineSpacing = 7
        collectionView.collectionViewLayout = flow
    }
    
    func showEstablishmentDetail(segue: UIStoryboardSegue) {
        if let viewController = segue.destination as? EstablishmentDetailViewController,
           let indexPath = collectionView.indexPathsForSelectedItems?.first {
            selectedEstablishment = manager.establishmentItem(at: indexPath.row)
            viewController.selectedEstablishment = selectedEstablishment
        }
    }
    
    func createData() {
        guard let city = selectedCity?.city,
              let tag = selectedTags else {
                  return
              }
        manager.fetch(location: city, selectedEthanol: tag) {
            establishmentItems in
            if !establishmentItems.isEmpty {
                collectionView.backgroundView = nil
            } else {
                let view = NoDataView(frame: CGRect(x: 0, y: 0, width: collectionView.frame.width, height: collectionView.frame.height))
                view.set(title: "Drinking Establishments", desc: "No establishments found.", accomm: "No accommodations found.", rating: "0.0", count: "0")
                collectionView.backgroundView = view
            }
            collectionView.reloadData()
        }
    }
    
    func setupTitle() {
        navigationController?.setNavigationBarHidden(false, animated: false)
        title = selectedCity?.cityAndState
        navigationController?.navigationBar.prefersLargeTitles = true
    }
}

// TODO: CORRECT THE POSITION OF THE BOTTOM DATA

extension DrinkingEstablishmentsListViewController: UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        var columns: CGFloat = 1
        if Device.isPad {
            columns = 2
        } else {
            columns = traitCollection.horizontalSizeClass == .compact ? 1 : 2
        }
        let viewWidth = collectionView.frame.size.width
        let inset = 9.0
        let contentWidth = viewWidth - inset * (columns + 1)
        let cellWidth = contentWidth / columns
        let cellHeigth = 312.0
        return CGSize(width: cellWidth, height: cellHeigth)
    }
}

// MARK:: UIColletionViewDataSource
extension DrinkingEstablishmentsListViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        manager.numberOfEstablishmentItems()
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "establishmentCell", for: indexPath) as! DrinkingEstablishmentCell
        let establishmentItem = manager.establishmentItem(at: indexPath.row)
        cell.titleLabel.text = establishmentItem.name
        if let tag = establishmentItem.subtitle {
            cell.tagLabel.text = tag
        }
        
        if let accommodation = establishmentItem.accommodation_attributes {
            cell.accommodationsLabel.text = accommodation
        }
        cell.ratingLabel.text = establishmentItem.rating_value
        cell.countLabel.text = establishmentItem.rating_count
        return cell
    }
}

class ExploreCell: UICollectionViewCell {
   
    @IBOutlet var exploreImageView: UIImageView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        exploreImageView.layer.cornerRadius = 9
        exploreImageView.layer.masksToBounds = true
    }
}

class ExploreHeaderView: UICollectionReusableView {
        
    @IBOutlet var locationLabel: UILabel!
}

struct ExploreItem {
    let name: String?
    let image: String?
}

let myExploreItem = ExploreItem(name: "name", image: "image")

extension ExploreItem {
    init(dict: [String: String]) {
        self.name = dict["name"]
        self.image = dict["image"]
    }
}

class ExploreDataManager: DataManager {
    private var exploreItems: [ExploreItem] = []

    func fetch() {
        for data in loadPlist(file: "ExploreData") {
            exploreItems.append(ExploreItem(dict: data as! [String: String]))
        }
    }
    
    func numberOfExploreItems() -> Int {
        exploreItems.count
    }
    
    func exploreItem(at index: Int) -> ExploreItem {
        exploreItems[index]
    }
}

class ExploreViewController: UIViewController, UICollectionViewDelegate {

    @IBOutlet weak var collectionView: UICollectionView!
    let manager = ExploreDataManager()
    var selectedCity: LocationItem?
    var headerView: ExploreHeaderView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        initialize()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: false)
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        switch segue.identifier! {
        case Segue.locationList.rawValue:
            showLocationList(segue: segue)
        case Segue.establishmentList.rawValue:
            showEstablishmentList(segue: segue)
        default:
            print("Segue not added.")
        }
    }
    
    override func shouldPerformSegue(withIdentifier identifier: String, sender: Any?) -> Bool {
        if identifier == Segue.establishmentList.rawValue,
           selectedCity == nil {
            showLocationRequiredAction()
            return false
        }
        return true
    }
}

// MARK: Private Extension
private extension ExploreViewController {
    func initialize() {
        manager.fetch()
        setupCollectionView()
    }
    
    func setupCollectionView() {
        let flow = UICollectionViewFlowLayout()
        flow.sectionInset = UIEdgeInsets(top: 7, left: 7, bottom: 7, right: 7)
        flow.minimumInteritemSpacing = 0
        flow.minimumLineSpacing = 7
        collectionView.collectionViewLayout = flow
    }
    
    func showLocationList(segue: UIStoryboardSegue) {
        guard let navController = segue.destination as? UINavigationController,
              let viewController = navController.topViewController as? LocationViewController else {
                  return
              }
        viewController.selectedCity = selectedCity
    }
    
    
    func showEstablishmentList(segue: UIStoryboardSegue) {
        if let viewController = segue.destination as? DrinkingEstablishmentsListViewController,
           let city = selectedCity,
           let index = collectionView.indexPathsForSelectedItems?.first?.row {
            viewController.selectedTags = manager.exploreItem(at: index).name
            viewController.selectedCity = city
        }
    }
    
    func showLocationRequiredAction() {
        let alertController = UIAlertController(title: "Location Needed", message: "Please select a location.", preferredStyle: .alert)
        let okAction = UIAlertAction(title: "Ok", style: .default, handler: nil)
        alertController.addAction(okAction)
        present(alertController, animated: true, completion: nil)
    }
    
    @IBAction func unwindLocationCancel(segue: UIStoryboardSegue) {
    }
    
    @IBAction func unwindLocationDone(segue: UIStoryboardSegue) {
        if let viewController = segue.source as? LocationViewController {
            selectedCity = viewController.selectedCity
            if let location = selectedCity {
                headerView.locationLabel.text = location.cityAndState
            }
        }
    }
}

extension ExploreViewController: UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        var columns: CGFloat = 2
        if Device.isPad || (traitCollection.horizontalSizeClass != .compact) {
            columns = 2
        }
        if Device.isPhone || (traitCollection.horizontalSizeClass != .compact) {
            columns = 1
        }
        let viewWidth = collectionView.frame.size.width
        let inset = 7.0
        let contentWidth = viewWidth - inset * (columns + 1)
        let cellWidth = contentWidth / columns
        let cellHeight = cellWidth
        return CGSize(width: cellWidth, height: cellHeight)
    }

    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, referenceSizeForHeaderInSection secton: Int) -> CGSize {
        return CGSize(width: collectionView.frame.width, height: 100)
    }
}

// MARK: UICollectionViewDataSource
extension ExploreViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, viewForSupplementaryElementOfKind kind: String, at indexPath: IndexPath) -> UICollectionReusableView {
        let header = collectionView.dequeueReusableSupplementaryView(ofKind: kind, withReuseIdentifier: "header", for: indexPath)
        headerView = header as? ExploreHeaderView
        return headerView
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        manager.numberOfExploreItems()  // Number of app panes
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "exploreCell", for: indexPath) as! ExploreCell
        let exploreItem = manager.exploreItem(at: indexPath.row)
        cell.exploreImageView.image = UIImage(named: exploreItem.image!)
        return cell
    }
}

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        return true
    }

    // MARK: UISceneSession Lifecycle
    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
        // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
        // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
    }
}

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?


    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        // Use this method to optionally configure and attach the UIWindow `window` to the provided UIWindowScene `scene`.
        // If using a storyboard, the `window` property will automatically be initialized and attached to the scene.
        // This delegate does not imply the connecting scene or session are new (see `application:configurationForConnectingSceneSession` instead).
        guard let _ = (scene as? UIWindowScene) else { return }
    }

    func sceneDidDisconnect(_ scene: UIScene) {
        // Called as the scene is being released by the system.
        // This occurs shortly after the scene enters the background, or when its session is discarded.
        // Release any resources associated with this scene that can be re-created the next time the scene connects.
        // The scene may re-connect later, as its session was not necessarily discarded (see `application:didDiscardSceneSessions` instead).
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        // Called when the scene has moved from an inactive state to an active state.
        // Use this method to restart any tasks that were paused (or not yet started) when the scene was inactive.
    }

    func sceneWillResignActive(_ scene: UIScene) {
        // Called when the scene will move from an active state to an inactive state.
        // This may occur due to temporary interruptions (ex. an incoming phone call).
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        // Called as the scene transitions from the background to the foreground.
        // Use this method to undo the changes made on entering the background.
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        // Called as the scene transitions from the foreground to the background.
        // Use this method to save data, release shared resources, and store enough scene-specific state information
        // to restore the scene back to its current state.
    }
}
