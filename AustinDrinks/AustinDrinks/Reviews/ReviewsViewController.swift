//
//  ReviewsViewController.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/28/22.
//

import UIKit
import MapKit

// ReviewsViewController is a UIViewController
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
    
    // Similar to the PhotoViewController, we have here proportional properties for the Reviews Flow design
    func setupCollectionView() {
        let flow = UICollectionViewFlowLayout()
        flow.sectionInset = UIEdgeInsets(top: 7, left: 7, bottom: 7, right: 7)
        flow.minimumInteritemSpacing = 0
        flow.minimumLineSpacing = 7
        // This property allows the flow layout to be scrolled left and right to view all reviews postings
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
                view.set(title: "Reviews", desc: "There are currently no reviews.", accomm: "", rating: "", count: "") 
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
    
    // The collection view for reviews cell; provides for all the properties--e.g., the 'name' of the reviewer (should she wish to disclose her name)--relevant
    // to the ReviewsView.
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
