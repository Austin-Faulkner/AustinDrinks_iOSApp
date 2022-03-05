//
//  EstablishmentDetailTableViewController.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 3/1/22.
//

import UIKit
import MapKit

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
        
        title = establishment.name  // not sure about this
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

//extension EstablishmentDetailViewController: UICollectionViewDelegateFlowLayout {
//    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
//        let viewWidth = collectionView.frame.size.width
//        let inset = 9.0
//        let contentWidth = viewWidth - inset
//        let cellWidth = contentWidth
//        let cellHeigth = 312.0
//        return CGSize(width: cellWidth, height: cellHeigth)
//    }
//}


