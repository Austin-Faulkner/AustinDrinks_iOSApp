//
//  PhotoFilterViewController.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 3/8/22.
//

import UIKit
import AVFoundation


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
    
    // The saving business logic for the photo the user chooses from 'Photos' or Albums' on her device
    // Device can be an iPad, or iPhone all the back to version 7 of the iPhone, but the iOS needs to be
    // updated to iOS 15.0 or greater.
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
